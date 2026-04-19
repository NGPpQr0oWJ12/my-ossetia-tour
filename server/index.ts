import express from "express";
import type { Request, Response, NextFunction } from "express";
import { supabaseRest } from "./supabase.ts";
import {
  getRuntimeConfig,
  sanitizeConfig,
  updateRuntimeConfig,
} from "./runtimeConfig.ts";
import {
  parseHomeContent,
  parseLeadInsert,
  parseLeadUpdate,
  parseTourUpsert,
} from "./validation.ts";
import { authenticateAdmin, createAdminSession, verifyAdminSession } from "./adminAuth.ts";
import {
  DEFAULT_HOME_CONTENT,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_TOURS,
} from "./defaultContent.ts";

const app = express();
const PORT = Number(process.env.API_PORT ?? 8787);

app.use(express.json({ limit: "2mb" }));
app.use(express.raw({ type: "image/*", limit: "50mb" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "authorization, content-type, x-filename");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing token" });
    return;
  }
  const token = header.slice("Bearer ".length);
  if (!(await verifyAdminSession(token))) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  next();
}

app.get(
  "/api/health",
  asyncHandler(async (_req, res) => {
    const config = await getRuntimeConfig();
    res.json({
      ok: true,
      has_supabase: Boolean(
        config.supabaseUrl && config.supabaseAnonKey && config.supabaseServiceRoleKey,
      ),
      telegram_enabled: Boolean(config.telegramEnabled),
    });
  }),
);

app.get(
  "/api/setup/status",
  asyncHandler(async (_req, res) => {
    const config = await getRuntimeConfig();
    res.json({
      hasSupabase: Boolean(
        config.supabaseUrl && config.supabaseAnonKey && config.supabaseServiceRoleKey,
      ),
    });
  }),
);

app.post(
  "/api/setup/bootstrap",
  asyncHandler(async (req, res) => {
    const config = await getRuntimeConfig();
    if (config.supabaseUrl && config.supabaseAnonKey && config.supabaseServiceRoleKey) {
      res.status(409).json({ error: "Supabase is already configured" });
      return;
    }
    const body = req.body as Record<string, unknown>;
    const supabaseUrl =
      typeof body.supabaseUrl === "string" ? body.supabaseUrl.trim() : "";
    const supabaseAnonKey =
      typeof body.supabaseAnonKey === "string" ? body.supabaseAnonKey.trim() : "";
    const supabaseServiceRoleKey =
      typeof body.supabaseServiceRoleKey === "string"
        ? body.supabaseServiceRoleKey.trim()
        : "";
    const adminEmails = Array.isArray(body.adminEmails)
      ? body.adminEmails
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      res.status(400).json({ error: "Supabase URL and keys are required" });
      return;
    }
    const next = await updateRuntimeConfig({
      supabaseUrl,
      supabaseAnonKey,
      supabaseServiceRoleKey,
      adminEmails,
    });
    res.status(201).json(sanitizeConfig(next));
  }),
);

app.get(
  "/api/public/site-settings",
  asyncHandler(async (_req, res) => {
    const config = await getRuntimeConfig();
    res.json(config.siteSettings);
  }),
);

app.post(
  "/api/admin/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body ?? {};
    if (typeof username !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "username and password are required" });
      return;
    }
    if (!authenticateAdmin(username.trim(), password)) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const accessToken = await createAdminSession();
    res.json({ access_token: accessToken });
  }),
);

app.post(
  "/api/leads",
  asyncHandler(async (req, res) => {
    const lead = parseLeadInsert(req.body);
    const rows = await supabaseRest("/rest/v1/leads", {
      method: "POST",
      body: [{ ...lead, status: "new" }],
    });
    await sendTelegramLeadNotification(rows?.[0]);
    res.status(201).json(rows?.[0] ?? null);
  }),
);

app.get(
  "/api/admin/integrations",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const config = await getRuntimeConfig();
    res.json(sanitizeConfig(config));
  }),
);

app.patch(
  "/api/admin/integrations",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const body = req.body as Record<string, unknown>;
    const next = await updateRuntimeConfig({
      supabaseUrl:
        typeof body.supabaseUrl === "string" ? body.supabaseUrl.trim() : undefined,
      supabaseAnonKey:
        typeof body.supabaseAnonKey === "string" ? body.supabaseAnonKey.trim() : undefined,
      supabaseServiceRoleKey:
        typeof body.supabaseServiceRoleKey === "string"
          ? body.supabaseServiceRoleKey.trim()
          : undefined,
      adminEmails: Array.isArray(body.adminEmails)
        ? body.adminEmails
            .filter((item): item is string => typeof item === "string")
            .map((item) => item.trim())
            .filter(Boolean)
        : undefined,
      telegramBotToken:
        typeof body.telegramBotToken === "string" ? body.telegramBotToken.trim() : undefined,
      telegramChatId:
        typeof body.telegramChatId === "string" ? body.telegramChatId.trim() : undefined,
      telegramEnabled:
        typeof body.telegramEnabled === "boolean" ? body.telegramEnabled : undefined,
    });
    res.json(sanitizeConfig(next));
  }),
);

app.post(
  "/api/admin/integrations/test-supabase",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    await supabaseRest("/rest/v1/home_content", {
      query: { select: "id", limit: "1" },
    });
    res.json({ ok: true });
  }),
);

app.post(
  "/api/admin/integrations/test-telegram",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const ok = await sendTelegramMessage(
      `Test message from admin panel: ${new Date().toISOString()}`,
    );
    if (!ok) {
      res.status(400).json({ error: "Telegram is not configured or request failed" });
      return;
    }
    res.json({ ok: true });
  }),
);

app.post(
  "/api/admin/upload-media",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const config = await getRuntimeConfig();
    if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
      res.status(400).json({ error: "Supabase is not configured" });
      return;
    }

    await ensureBucketExists(config.supabaseUrl, config.supabaseServiceRoleKey);

    const contentType = (req.headers["content-type"] ?? "application/octet-stream") as string;
    const extension = contentType.startsWith("image/png") ? "png"
      : contentType.startsWith("image/gif") ? "gif"
      : contentType.startsWith("image/webp") ? "webp"
      : "jpg";
    const objectPath = `uploads/${Date.now()}-${Math.random().toString(16).slice(2)}.${extension}`;

    const uploadRes = await fetch(
      `${config.supabaseUrl}/storage/v1/object/crm-media/${objectPath}`,
      {
        method: "POST",
        headers: {
          apikey: config.supabaseServiceRoleKey,
          Authorization: `Bearer ${config.supabaseServiceRoleKey}`,
          "x-upsert": "true",
          "Content-Type": contentType,
        },
        body: req.body,
      },
    );
    if (!uploadRes.ok) {
      const error = await uploadRes.text();
      res.status(400).json({ error: error || "Upload failed" });
      return;
    }
    const publicUrl = `${config.supabaseUrl}/storage/v1/object/public/crm-media/${objectPath}`;
    res.json({ url: publicUrl });
  }),
);

app.get(
  "/api/admin/site-settings",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const config = await getRuntimeConfig();
    res.json(config.siteSettings);
  }),
);

app.patch(
  "/api/admin/site-settings",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const body = req.body as Record<string, unknown>;
    const patch: Record<string, string> = {};
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        patch[key] = value;
      }
    }
    const next = await updateRuntimeConfig({ siteSettings: patch });
    res.json(next.siteSettings);
  }),
);

app.post(
  "/api/admin/bootstrap-default-content",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const tours = await supabaseRest("/rest/v1/tours", {
      query: { select: "id,slug", order: "id.asc" },
    });
    const existingBySlug = new Set(
      (tours ?? [])
        .map((item: { slug?: string }) => item.slug)
        .filter((slug: string | undefined): slug is string => Boolean(slug)),
    );

    for (const tour of DEFAULT_TOURS) {
      if (existingBySlug.has(tour.slug)) continue;
      const inserted = await supabaseRest("/rest/v1/tours", {
        method: "POST",
        body: [
          {
            slug: tour.slug,
            title: tour.title,
            short_description: tour.short_description,
            full_description: tour.full_description,
            price_from: tour.price_from,
            duration: tour.duration,
            group_size: tour.group_size,
            location: tour.location,
            cover_image_url: tour.cover_image_url,
            gallery: tour.gallery,
            is_published: tour.is_published,
            sort_order: tour.sort_order,
            seo_title: tour.seo_title,
            seo_description: tour.seo_description,
          },
        ],
      });
      const row = inserted?.[0];
      if (row && tour.program_items.length > 0) {
        await supabaseRest("/rest/v1/tour_program_items", {
          method: "POST",
          body: tour.program_items.map((item) => ({
            ...item,
            tour_id: row.id,
          })),
        });
      }
    }

    const toursAfter = await supabaseRest("/rest/v1/tours", {
      query: { select: "id,sort_order", is_published: "eq.true", order: "sort_order.asc" },
    });
    const featured = (toursAfter ?? [])
      .slice(0, 3)
      .map((item: { id: number }) => item.id);

    const homeRows = await supabaseRest("/rest/v1/home_content", {
      query: { select: "id", id: "eq.1", limit: "1" },
    });
    if (!homeRows?.length) {
      await supabaseRest("/rest/v1/home_content", {
        method: "POST",
        body: [{ id: 1, ...DEFAULT_HOME_CONTENT, featured_tour_ids: featured }],
      });
    } else {
      await supabaseRest("/rest/v1/home_content", {
        method: "PATCH",
        query: { id: "eq.1", select: "id" },
        body: { ...DEFAULT_HOME_CONTENT, featured_tour_ids: featured },
      });
    }

    const current = await getRuntimeConfig();
    const hasCustomSettings = Object.keys(current.siteSettings ?? {}).length > 0;
    if (!hasCustomSettings) {
      await updateRuntimeConfig({ siteSettings: { ...DEFAULT_SITE_SETTINGS } });
    }

    res.json({ ok: true });
  }),
);

app.get(
  "/api/public/tours",
  asyncHandler(async (_req, res) => {
    const rows = await supabaseRest("/rest/v1/tours", {
      query: {
        select: "*",
        is_published: "eq.true",
        order: "sort_order.asc",
      },
    });
    res.json(rows ?? []);
  }),
);

app.get(
  "/api/public/tours/:slug",
  asyncHandler(async (req, res) => {
    const slug = req.params.slug;
    const tours = await supabaseRest("/rest/v1/tours", {
      query: {
        select: "*",
        slug: `eq.${slug}`,
        is_published: "eq.true",
        limit: "1",
      },
    });
    const tour = tours?.[0];
    if (!tour) {
      res.status(404).json({ error: "Tour not found" });
      return;
    }
    const items = await supabaseRest("/rest/v1/tour_program_items", {
      query: {
        select: "*",
        tour_id: `eq.${tour.id}`,
        order: "position.asc",
      },
    });
    res.json({ ...tour, program_items: items ?? [] });
  }),
);

app.get(
  "/api/public/tours-by-id/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const tours = await supabaseRest("/rest/v1/tours", {
      query: {
        select: "*",
        id: `eq.${id}`,
        is_published: "eq.true",
        limit: "1",
      },
    });
    const tour = tours?.[0];
    if (!tour) {
      res.status(404).json({ error: "Tour not found" });
      return;
    }
    const items = await supabaseRest("/rest/v1/tour_program_items", {
      query: {
        select: "*",
        tour_id: `eq.${tour.id}`,
        order: "position.asc",
      },
    });
    res.json({ ...tour, program_items: items ?? [] });
  }),
);

app.get(
  "/api/public/home",
  asyncHandler(async (_req, res) => {
    const rows = await supabaseRest("/rest/v1/home_content", {
      query: {
        select: "*",
        id: "eq.1",
        limit: "1",
      },
    });
    const home = rows?.[0];
    if (!home) {
      res.status(404).json({ error: "Home content not found" });
      return;
    }
    let featuredTours: unknown[] = [];
    const idsToFetch = Array.isArray(home.featured_tour_ids) ? [...home.featured_tour_ids] : [];
    if (home.hero_tour_id && !idsToFetch.includes(home.hero_tour_id)) {
      idsToFetch.push(home.hero_tour_id);
    }

    if (idsToFetch.length > 0) {
      const idList = idsToFetch.join(",");
      featuredTours = await supabaseRest("/rest/v1/tours", {
        query: {
          select: "*",
          id: `in.(${idList})`,
          is_published: "eq.true",
        },
      });
    }
    res.json({ ...home, featured_tours: featuredTours ?? [] });
  }),
);

app.get(
  "/api/admin/leads",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const rows = await supabaseRest("/rest/v1/leads", {
      query: { select: "*", order: "created_at.desc" },
    });
    res.json(rows ?? []);
  }),
);

app.patch(
  "/api/admin/leads/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const patch = parseLeadUpdate(req.body);
    const rows = await supabaseRest("/rest/v1/leads", {
      method: "PATCH",
      query: { id: `eq.${id}`, select: "*" },
      body: patch,
    });
    res.json(rows?.[0] ?? null);
  }),
);

app.get(
  "/api/admin/tours",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const rows = await supabaseRest("/rest/v1/tours", {
      query: { select: "*", order: "sort_order.asc" },
    });
    res.json(rows ?? []);
  }),
);

app.get(
  "/api/admin/tours/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const tours = await supabaseRest("/rest/v1/tours", {
      query: {
        select: "*",
        id: `eq.${id}`,
        limit: "1",
      },
    });
    const tour = tours?.[0];
    if (!tour) {
      res.status(404).json({ error: "Tour not found" });
      return;
    }

    const items = await supabaseRest("/rest/v1/tour_program_items", {
      query: {
        select: "*",
        tour_id: `eq.${tour.id}`,
        order: "position.asc",
      },
    });

    res.json({ ...tour, program_items: items ?? [] });
  }),
);

app.post(
  "/api/admin/tours",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const dto = parseTourUpsert(req.body);
    const insertedTours = await supabaseRest("/rest/v1/tours", {
      method: "POST",
      body: [
        {
          slug: dto.slug,
          title: dto.title,
          short_description: dto.short_description,
          full_description: dto.full_description,
          price_from: dto.price_from,
          duration: dto.duration,
          group_size: dto.group_size,
          location: dto.location,
          cover_image_url: dto.cover_image_url,
          gallery: dto.gallery,
          is_published: dto.is_published,
          sort_order: dto.sort_order,
          seo_title: dto.seo_title,
          seo_description: dto.seo_description,
        },
      ],
    });
    const inserted = insertedTours?.[0];
    if (!inserted) {
      res.status(500).json({ error: "Failed to create tour" });
      return;
    }

    if (dto.program_items.length > 0) {
      await supabaseRest("/rest/v1/tour_program_items", {
        method: "POST",
        body: dto.program_items.map((item) => ({
          ...item,
          tour_id: inserted.id,
        })),
      });
    }

    res.status(201).json(inserted);
  }),
);

app.patch(
  "/api/admin/tours/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }
    const dto = parseTourUpsert(req.body);
    const rows = await supabaseRest("/rest/v1/tours", {
      method: "PATCH",
      query: { id: `eq.${id}`, select: "*" },
      body: {
        slug: dto.slug,
        title: dto.title,
        short_description: dto.short_description,
        full_description: dto.full_description,
        price_from: dto.price_from,
        duration: dto.duration,
        group_size: dto.group_size,
        location: dto.location,
        cover_image_url: dto.cover_image_url,
        gallery: dto.gallery,
        is_published: dto.is_published,
        sort_order: dto.sort_order,
        seo_title: dto.seo_title,
        seo_description: dto.seo_description,
      },
    });
    await supabaseRest("/rest/v1/tour_program_items", {
      method: "DELETE",
      query: { tour_id: `eq.${id}` },
    });
    if (dto.program_items.length > 0) {
      await supabaseRest("/rest/v1/tour_program_items", {
        method: "POST",
        body: dto.program_items.map((item) => ({
          ...item,
          tour_id: id,
        })),
      });
    }
    res.json(rows?.[0] ?? null);
  }),
);

app.delete(
  "/api/admin/tours/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    await supabaseRest("/rest/v1/tours", {
      method: "DELETE",
      query: { id: `eq.${id}` },
    });

    res.json({ ok: true });
  }),
);

app.get(
  "/api/admin/home",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const rows = await supabaseRest("/rest/v1/home_content", {
      query: { select: "*", id: "eq.1", limit: "1" },
    });
    res.json(rows?.[0] ?? null);
  }),
);

app.patch(
  "/api/admin/home",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const dto = parseHomeContent(req.body);
    const rows = await supabaseRest("/rest/v1/home_content", {
      method: "PATCH",
      query: { id: "eq.1", select: "*" },
      body: dto,
    });
    res.json(rows?.[0] ?? null);
  }),
);

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(400).json({ error: error.message || "Unknown error" });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server started on http://localhost:${PORT}`);
});

async function sendTelegramMessage(text: string): Promise<boolean> {
  const config = await getRuntimeConfig();
  if (!config.telegramEnabled || !config.telegramBotToken || !config.telegramChatId) {
    return false;
  }
  const response = await fetch(
    `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.telegramChatId,
        text,
      }),
    },
  );
  return response.ok;
}

async function sendTelegramLeadNotification(lead: Record<string, unknown> | undefined) {
  if (!lead) return;
  const text = [
    "New CRM lead",
    `ID: ${String(lead.id ?? "")}`,
    `Source: ${String(lead.source_page ?? "")}`,
    `Name: ${String(lead.name ?? "")}`,
    `Phone: ${String(lead.phone ?? "")}`,
    `Message: ${String(lead.message ?? "")}`,
  ].join("\n");
  await sendTelegramMessage(text);
}

async function ensureBucketExists(supabaseUrl: string, serviceKey: string) {
  const bucketId = "crm-media";
  const checkRes = await fetch(
    `${supabaseUrl}/storage/v1/bucket/${bucketId}`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    },
  );
  if (checkRes.ok) return;

  const createRes = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: bucketId,
      name: " CRM Media",
      public: true,
    }),
  });
  if (!createRes.ok) {
    const err = await createRes.text();
    console.error("Failed to create bucket:", err);
  }
}
