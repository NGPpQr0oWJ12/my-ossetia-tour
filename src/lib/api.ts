import type {
  HomeContent,
  Lead,
  LeadInsertInput,
  LeadStatus,
  Tour,
  TourUpsertInput,
  TourWithProgram,
} from "./types";

const ADMIN_TOKEN_KEY = "admin_access_token";

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
  token?: string;
}

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(path, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Request failed");
  }
  return data as T;
}

export const authStorage = {
  getToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },
};

export const publicApi = {
  getTours() {
    return apiRequest<Tour[]>("/api/public/tours");
  },
  getTour(slug: string) {
    return apiRequest<TourWithProgram>(`/api/public/tours/${slug}`);
  },
  getTourById(id: number) {
    return apiRequest<TourWithProgram>(`/api/public/tours-by-id/${id}`);
  },
  getHome() {
    return apiRequest<HomeContent>("/api/public/home");
  },
  createLead(payload: LeadInsertInput) {
    return apiRequest<Lead>("/api/leads", { method: "POST", body: payload });
  },
};

export const adminApi = {
  async login(username: string, password: string) {
    const session = await apiRequest<{ access_token: string }>("/api/admin/login", {
      method: "POST",
      body: { username, password },
    });
    authStorage.setToken(session.access_token);
    return session;
  },
  getLeads() {
    return apiRequest<Lead[]>("/api/admin/leads", { token: authStorage.getToken() ?? "" });
  },
  updateLead(id: number, status: LeadStatus, managerComment: string) {
    return apiRequest<Lead>(`/api/admin/leads/${id}`, {
      method: "PATCH",
      token: authStorage.getToken() ?? "",
      body: { status, manager_comment: managerComment },
    });
  },
  getTours() {
    return apiRequest<Tour[]>("/api/admin/tours", { token: authStorage.getToken() ?? "" });
  },
  getTour(id: number) {
    return apiRequest<TourWithProgram>(`/api/admin/tours/${id}`, {
      token: authStorage.getToken() ?? "",
    });
  },
  createTour(payload: TourUpsertInput) {
    return apiRequest<Tour>("/api/admin/tours", {
      method: "POST",
      token: authStorage.getToken() ?? "",
      body: payload,
    });
  },
  updateTour(id: number, payload: TourUpsertInput) {
    return apiRequest<Tour>(`/api/admin/tours/${id}`, {
      method: "PATCH",
      token: authStorage.getToken() ?? "",
      body: payload,
    });
  },
  getHome() {
    return apiRequest<HomeContent>("/api/admin/home", {
      token: authStorage.getToken() ?? "",
    });
  },
  updateHome(payload: Omit<HomeContent, "id" | "updated_at" | "featured_tours">) {
    return apiRequest<HomeContent>("/api/admin/home", {
      method: "PATCH",
      token: authStorage.getToken() ?? "",
      body: payload,
    });
  },
  bootstrapDefaultContent() {
    return apiRequest<{ ok: boolean }>("/api/admin/bootstrap-default-content", {
      method: "POST",
      token: authStorage.getToken() ?? "",
    });
  },
  getSiteSettings() {
    return apiRequest<Record<string, string>>("/api/admin/site-settings", {
      token: authStorage.getToken() ?? "",
    });
  },
  updateSiteSettings(payload: Record<string, string>) {
    return apiRequest<Record<string, string>>("/api/admin/site-settings", {
      method: "PATCH",
      token: authStorage.getToken() ?? "",
      body: payload,
    });
  },
};

export const publicSettingsApi = {
  getSiteSettings() {
    return apiRequest<Record<string, string>>("/api/public/site-settings");
  },
};

export async function uploadToSupabaseStorage(
  file: File,
  token: string,
): Promise<string> {
  const res = await fetch("/api/admin/upload-media", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: file,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error ?? "Upload failed");
  }
  return data.url as string;
}
