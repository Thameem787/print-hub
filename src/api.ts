// ─── PrintHub API Service ─────────────────────────────────────────────────────
// All backend calls go through here.

const BASE_URL = 'http://localhost:5000/api';

function getToken(): string | null {
  return localStorage.getItem('printhub_token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(
  method: string,
  path: string,
  body?: object
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }

  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export const auth = {
  register: (body: { name: string; email: string; password: string; role: 'customer' | 'vendor' }) =>
    request<AuthResponse>('POST', '/auth/register', body),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>('POST', '/auth/login', body),

  me: () => request<{ user: User }>('GET', '/auth/me'),
};

// ── Orders ────────────────────────────────────────────────────────────────────

export interface Order {
  id: number;
  file_name: string;
  material: string;
  color: string;
  quantity: number;
  estimated_grams: number;
  delivery_type: 'pickup' | 'delivery';
  status: 'pending' | 'accepted' | 'printing' | 'ready' | 'delivered' | 'cancelled';
  total_cost: number;
  material_cost: number;
  print_cost: number;
  delivery_cost: number;
  vendor_id?: number;
  shop_name?: string;
  vendor_city?: string;
  customer_name?: string;
  notes?: string;
  created_at: string;
}

export interface EstimateResponse {
  estimate: {
    materialCost: number;
    printCost: number;
    deliveryCost: number;
    totalCost: number;
  };
}

export const orders = {
  create: (body: {
    vendor_id: number;
    file_name: string;
    file_size_mb?: number;
    material: string;
    color: string;
    quantity: number;
    estimated_grams: number;
    delivery_type: 'pickup' | 'delivery';
    delivery_address?: string;
    notes?: string;
  }) => request<{ order_id: number; costs: EstimateResponse['estimate']; message: string }>('POST', '/orders', body),

  list: () => request<{ orders: Order[] }>('GET', '/orders'),

  get: (id: number) => request<{ order: Order }>('GET', `/orders/${id}`),

  updateStatus: (id: number, status: string) =>
    request<{ message: string }>('PATCH', `/orders/${id}/status`, { status }),

  cancel: (id: number) => request<{ message: string }>('DELETE', `/orders/${id}`),

  estimate: (body: {
    vendor_id: number;
    material: string;
    estimated_grams: number;
    quantity: number;
    delivery_type: 'pickup' | 'delivery';
  }) => request<EstimateResponse>('POST', '/orders/estimate', body),
};

// ── Vendors ───────────────────────────────────────────────────────────────────

export interface Vendor {
  id: number;
  shop_name: string;
  description?: string;
  address: string;
  city: string;
  materials: string[];
  colors: string[];
  price_per_gram: number;
  is_available: number;
  owner_name: string;
  distance_km?: number;
}

export const vendors = {
  list: (params?: { city?: string; material?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<{ vendors: Vendor[] }>('GET', `/vendors${q ? `?${q}` : ''}`);
  },

  get: (id: number) => request<Vendor>('GET', `/vendors/${id}`),

  onboard: (body: {
    shop_name: string;
    address: string;
    city: string;
    materials: string[];
    colors: string[];
    price_per_gram: number;
    description?: string;
  }) => request<{ message: string; vendor_id: number }>('POST', '/vendors', body),

  myOrders: () => request<{ orders: Order[] }>('GET', '/vendors/me/orders'),

  toggleAvailability: () =>
    request<{ is_available: boolean }>('PATCH', '/vendors/availability'),
};
