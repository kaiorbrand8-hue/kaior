import type {
  AdminReviewEntry,
  AdminStats,
  AdminUserEntry,
  Category,
  Order,
  PaginatedProducts,
  Product,
  ReviewStatus,
  SiteSettings,
  User,
} from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "kaior_token";
const USER_KEY = "kaior_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(user: User) {
  if (typeof window === "undefined") return;
  if (user.token) localStorage.setItem(TOKEN_KEY, user.token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

type ApiFetchOptions = RequestInit & { auth?: boolean };

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { auth, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    cache: "no-store",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(data?.message || "Something went wrong", res.status);
  }

  return data as T;
}

// ---- Categories ----
export const getCategories = () => apiFetch<Category[]>("/categories");
export const getCategoryBySlug = (slug: string) =>
  apiFetch<Category>(`/categories/${slug}`);
export const createCategory = (payload: Partial<Category>) =>
  apiFetch<Category>("/categories", { method: "POST", body: JSON.stringify(payload), auth: true });
export const updateCategory = (id: string, payload: Partial<Category>) =>
  apiFetch<Category>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(payload), auth: true });
export const deleteCategory = (id: string) =>
  apiFetch<{ message: string }>(`/categories/${id}`, { method: "DELETE", auth: true });

// ---- Products ----
export type ProductQuery = {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  featured?: boolean;
  isNewArrival?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
  includeInactive?: boolean;
};

export const getProducts = (query: ProductQuery = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return apiFetch<PaginatedProducts>(`/products${qs ? `?${qs}` : ""}`, {
    auth: !!query.includeInactive,
  });
};

export const getProductBySlug = (slug: string) => apiFetch<Product>(`/products/${slug}`, { auth: true });
export const getProductById = (id: string) => apiFetch<Product>(`/products/id/${id}`, { auth: true });
export const createProduct = (payload: Partial<Product>) =>
  apiFetch<Product>("/products", { method: "POST", body: JSON.stringify(payload), auth: true });
export const updateProduct = (id: string, payload: Partial<Product>) =>
  apiFetch<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload), auth: true });
export const deleteProduct = (id: string) =>
  apiFetch<{ message: string }>(`/products/${id}`, { method: "DELETE", auth: true });
export const createReview = (id: string, payload: { rating: number; comment: string }) =>
  apiFetch<{ message: string }>(`/products/${id}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload),
    auth: true,
  });

// ---- Auth ----
export const registerUser = (payload: { name: string; email: string; password: string; phone?: string }) =>
  apiFetch<User>("/auth/register", { method: "POST", body: JSON.stringify(payload) });
export const loginUser = (payload: { email: string; password: string }) =>
  apiFetch<User>("/auth/login", { method: "POST", body: JSON.stringify(payload) });
export const googleLogin = (credential: string) =>
  apiFetch<User>("/auth/google", { method: "POST", body: JSON.stringify({ credential }) });
export const getMe = () => apiFetch<User>("/auth/me", { auth: true });
export const updateMe = (payload: Partial<User> & { password?: string }) =>
  apiFetch<User>("/auth/me", { method: "PUT", body: JSON.stringify(payload), auth: true });
export const addAddress = (payload: Record<string, string>) =>
  apiFetch<User["addresses"]>("/auth/me/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: true,
  });

// ---- Orders ----
export const createOrder = (payload: unknown) =>
  apiFetch<Order>("/orders", { method: "POST", body: JSON.stringify(payload), auth: true });
export const getMyOrders = () => apiFetch<Order[]>("/orders/my", { auth: true });
export const getOrderById = (id: string) => apiFetch<Order>(`/orders/${id}`, { auth: true });
export const getAllOrders = (query: { status?: string; page?: number; limit?: number } = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const qs = params.toString();
  return apiFetch<{ items: Order[]; page: number; pages: number; total: number }>(
    `/orders${qs ? `?${qs}` : ""}`,
    { auth: true }
  );
};
export const updateOrderStatus = (id: string, status: string) =>
  apiFetch<Order>(`/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
    auth: true,
  });

// ---- Admin ----
export const getAdminStats = () => apiFetch<AdminStats>("/admin/stats", { auth: true });

export const getUsers = (query: { keyword?: string; page?: number; limit?: number } = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const qs = params.toString();
  return apiFetch<{ items: AdminUserEntry[]; page: number; pages: number; total: number }>(
    `/admin/users${qs ? `?${qs}` : ""}`,
    { auth: true }
  );
};

// ---- Admin: Review Moderation ----
export const getAllReviews = (query: { status?: string; page?: number; limit?: number } = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const qs = params.toString();
  return apiFetch<{ items: AdminReviewEntry[]; page: number; pages: number; total: number }>(
    `/admin/reviews${qs ? `?${qs}` : ""}`,
    { auth: true }
  );
};
export const updateReviewStatus = (productId: string, reviewId: string, status: ReviewStatus) =>
  apiFetch<{ message: string }>(`/admin/reviews/${productId}/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
    auth: true,
  });
export const deleteReview = (productId: string, reviewId: string) =>
  apiFetch<{ message: string }>(`/admin/reviews/${productId}/${reviewId}`, {
    method: "DELETE",
    auth: true,
  });

// ---- Site Settings (homepage images) ----
export const getSiteSettings = () => apiFetch<SiteSettings>("/settings");
export const updateSiteSettings = (payload: Partial<SiteSettings>) =>
  apiFetch<SiteSettings>("/settings", { method: "PUT", body: JSON.stringify(payload), auth: true });

// ---- Uploads ----
// One file per request — keeps each request well under the ~4.5MB body cap
// that serverless hosts (Vercel) enforce, regardless of how many files the
// admin selects at once.
async function uploadSingleImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("images", file);

  const token = getToken();
  const res = await fetch(`${API_URL}/uploads`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(data?.message || "Failed to upload image", res.status);
  }

  return (data.urls as string[])[0];
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    urls.push(await uploadSingleImage(file));
  }
  return urls;
}
