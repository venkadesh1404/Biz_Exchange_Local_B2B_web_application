import {
  mockAuthService, mockListingService, mockBusinessService,
  mockRequestService, mockMatchService, mockDashboardService, mockDemoService,
} from '@/services/mock';
import type {
  AuthSession, LoginRequest, RegisterRequest, Listing, Business,
  ExchangeRequest, MatchResult, MatchFilters, DashboardSummary,
  CreateListingRequest, CreateRequestInput, RequestStatus,
  MarketplaceFilters,
} from '@/types';

// ============================================================
// SERVICE LAYER — Unified interface for mock and real API
// When VITE_API_BASE_URL is set, calls go to the Java Spring
// Boot REST API. When unset, calls go to the mock data service.
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const USE_MOCK = !API_BASE_URL;

export interface AuthService {
  login(req: LoginRequest): Promise<AuthSession>;
  register(req: RegisterRequest): Promise<AuthSession>;
  getCurrentSession(): AuthSession | null;
  logout(): void;
  updateBusiness(businessId: string, updates: Partial<Business>): Promise<Business>;
}

export interface ListingService {
  getAll(): Promise<Listing[]>;
  getById(id: string): Promise<Listing | null>;
  getByBusiness(businessId: string): Promise<Listing[]>;
  create(req: CreateListingRequest, business: Business): Promise<Listing>;
  update(id: string, updates: Partial<CreateListingRequest>): Promise<Listing>;
  delete(id: string): Promise<void>;
}

export interface BusinessService {
  getById(id: string): Promise<Business | null>;
  getListingsForBusiness(businessId: string): Promise<Listing[]>;
}

export interface RequestService {
  create(input: CreateRequestInput, requesterBusiness: Business): Promise<ExchangeRequest>;
  getSent(businessId: string): Promise<ExchangeRequest[]>;
  getReceived(businessId: string): Promise<ExchangeRequest[]>;
  updateStatus(requestId: string, status: RequestStatus, currentBusinessId: string): Promise<ExchangeRequest>;
}

export interface MatchService {
  findMatches(listingId: string, filters?: MatchFilters): Promise<MatchResult[]>;
}

export interface DashboardService {
  getSummary(businessId: string): Promise<DashboardSummary>;
}

export interface DemoService {
  reset(): Promise<void>;
}

// --- Mock implementations ---
const mockAuth: AuthService = mockAuthService;
const mockListings: ListingService = mockListingService;
const mockBusinesses: BusinessService = mockBusinessService;
const mockRequests: RequestService = mockRequestService;
const mockMatches: MatchService = mockMatchService;
const mockDashboard: DashboardService = mockDashboardService;
const mockDemo: DemoService = mockDemoService;

// --- HTTP API implementations (active when VITE_API_BASE_URL is set) ---
// These call the Java Spring Boot REST API. The endpoints match
// the API specification in the README. Token is attached as
// a Bearer token in the Authorization header.

function getToken(): string | null {
  const session = mockAuth.getCurrentSession();
  return session?.token ?? null;
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message ?? data.error ?? `Request failed: ${res.status}`);
  }
  return data as T;
}

const httpAuth: AuthService = {
  async login(req) {
    const data = await apiRequest<{ token: string; user: typeof mockAuth extends never ? never : any; business: Business }>(
      '/api/auth/login',
      { method: 'POST', body: JSON.stringify(req) }
    );
    const session = { token: data.token, user: data.user, business: data.business };
    localStorage.setItem('biz_session', JSON.stringify(session));
    return session as AuthSession;
  },
  async register(req) {
    const data = await apiRequest<{ token: string; user: any; business: Business }>(
      '/api/auth/register',
      { method: 'POST', body: JSON.stringify(req) }
    );
    const session = { token: data.token, user: data.user, business: data.business };
    localStorage.setItem('biz_session', JSON.stringify(session));
    return session as AuthSession;
  },
  getCurrentSession() {
    const raw = localStorage.getItem('biz_session');
    if (!raw) return null;
    try { return JSON.parse(raw) as AuthSession; } catch { return null; }
  },
  logout() { localStorage.removeItem('biz_session'); },
  updateBusiness(businessId, updates) {
    return apiRequest<Business>(`/api/businesses/${businessId}`, {
      method: 'PUT', body: JSON.stringify(updates),
    });
  },
};

const httpListings: ListingService = {
  async getAll() {
    return apiRequest<Listing[]>('/api/listings');
  },
  async getById(id) {
    return apiRequest<Listing>(`/api/listings/${id}`);
  },
  async getByBusiness(businessId) {
    return apiRequest<Listing[]>(`/api/listings?businessId=${businessId}`);
  },
  async create(req, _business) {
    return apiRequest<Listing>('/api/listings', {
      method: 'POST', body: JSON.stringify(req),
    });
  },
  async update(id, updates) {
    return apiRequest<Listing>(`/api/listings/${id}`, {
      method: 'PUT', body: JSON.stringify(updates),
    });
  },
  async delete(id) {
    await apiRequest<void>(`/api/listings/${id}`, { method: 'DELETE' });
  },
};

const httpBusinesses: BusinessService = {
  async getById(id) {
    return apiRequest<Business>(`/api/businesses/${id}`);
  },
  async getListingsForBusiness(businessId) {
    return apiRequest<Listing[]>(`/api/listings?businessId=${businessId}`);
  },
};

const httpRequests: RequestService = {
  async create(input, _business) {
    return apiRequest<ExchangeRequest>('/api/requests', {
      method: 'POST', body: JSON.stringify(input),
    });
  },
  async getSent(businessId) {
    return apiRequest<ExchangeRequest[]>(`/api/requests/sent?businessId=${businessId}`);
  },
  async getReceived(businessId) {
    return apiRequest<ExchangeRequest[]>(`/api/requests/received?businessId=${businessId}`);
  },
  async updateStatus(requestId, status, _bizId) {
    return apiRequest<ExchangeRequest>(`/api/requests/${requestId}/status`, {
      method: 'PATCH', body: JSON.stringify({ status }),
    });
  },
};

const httpMatches: MatchService = {
  async findMatches(listingId, filters) {
    const params = new URLSearchParams();
    if (filters?.location && filters.location !== 'ALL') params.set('location', filters.location);
    if (filters?.minQuantity) params.set('minQuantity', String(filters.minQuantity));
    if (filters?.maxPrice) params.set('maxPrice', String(filters.maxPrice));
    const qs = params.toString();
    return apiRequest<MatchResult[]>(`/api/matches/${listingId}${qs ? `?${qs}` : ''}`);
  },
};

const httpDashboard: DashboardService = {
  async getSummary(businessId) {
    return apiRequest<DashboardSummary>(`/api/dashboard/summary?businessId=${businessId}`);
  },
};

const httpDemo: DemoService = {
  async reset() {
    await apiRequest<void>('/api/demo/reset', { method: 'POST' });
  },
};

// --- Export the active implementation ---
export const authService: AuthService = USE_MOCK ? mockAuth : httpAuth;
export const listingService: ListingService = USE_MOCK ? mockListings : httpListings;
export const businessService: BusinessService = USE_MOCK ? mockBusinesses : httpBusinesses;
export const requestService: RequestService = USE_MOCK ? mockRequests : httpRequests;
export const matchService: MatchService = USE_MOCK ? mockMatches : httpMatches;
export const dashboardService: DashboardService = USE_MOCK ? mockDashboard : httpDashboard;
export const demoService: DemoService = USE_MOCK ? mockDemo : httpDemo;

export const isMockMode = USE_MOCK;

// Re-export for filtering/search helper used by UI
export function filterListings(listings: Listing[], filters: MarketplaceFilters): Listing[] {
  let result = [...listings];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((l) =>
      l.productName.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      l.businessName.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q)
    );
  }

  if (filters.listingType && filters.listingType !== 'ALL') {
    result = result.filter((l) => l.listingType === filters.listingType);
  }

  if (filters.category && filters.category !== 'ALL') {
    result = result.filter((l) => l.category === filters.category);
  }

  if (filters.city && filters.city !== 'ALL') {
    result = result.filter((l) => l.location === filters.city);
  }

  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    result = result.filter((l) => l.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    result = result.filter((l) => l.price <= filters.maxPrice!);
  }

  if (filters.minQuantity !== undefined && filters.minQuantity > 0) {
    result = result.filter((l) => l.quantity >= filters.minQuantity!);
  }

  if (filters.sortBy === 'relevance') {
    // Simple relevance: listings in same category as most common search term
    result.sort((a, b) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const aMatch = (a.productName.toLowerCase().includes(q) ? 2 : 0) + (a.description.toLowerCase().includes(q) ? 1 : 0);
        const bMatch = (b.productName.toLowerCase().includes(b.productName.toLowerCase()) ? 2 : 0) + (b.description.toLowerCase().includes(q) ? 1 : 0);
        return bMatch - aMatch;
      }
      return 0;
    });
  } else {
    result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  return result;
}
