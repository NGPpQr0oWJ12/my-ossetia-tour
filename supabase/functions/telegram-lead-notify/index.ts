// Supabase Edge Function: telegram-lead-notify
// Deploy:
//   supabase functions deploy telegram-lead-notify
// Configure secrets:
//   TELEGRAM_BOT_TOKEN=...
//   TELEGRAM_CHAT_ID=...

interface LeadPayload {
  type: string;
  record?: {
    id: number;
    source_page: string;
    name: string;
    phone: string;
    message?: string | null;
    created_at: string;
  };
}

function formatText(payload: LeadPayload): string {
  const lead = payload.record;
  if (!lead) return "New lead created";
  return [
    "New CRM lead",
    `ID: ${lead.id}`,
    `Source: ${lead.source_page}`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Message: ${lead.message ?? "-"}`,
    `Created: ${lead.created_at}`,
  ].join("\n");
}

Deno.serve(async (req) => {
  try {
    const payload = (await req.json()) as LeadPayload;
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
    if (!botToken || !chatId) {
      return new Response(JSON.stringify({ error: "Missing TELEGRAM env vars" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const text = formatText(payload);
    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!telegramRes.ok) {
      const err = await telegramRes.text();
      return new Response(JSON.stringify({ error: err }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
