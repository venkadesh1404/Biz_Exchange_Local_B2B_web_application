import type {
  User, Business, Listing, ExchangeRequest,
  LoginRequest, RegisterRequest, CreateListingRequest,
  CreateRequestInput, DashboardSummary, ActivityItem,
  ProductCategory, MatchResult, MatchFilters, RequestStatus,
} from '@/types';
import {
  SEED_USERS, SEED_BUSINESSES, SEED_LISTINGS, SEED_REQUESTS,
} from '@/data/seed';
import { matchListings } from '@/lib/matching';
import { generateId } from '@/lib/utils';

// ============================================================
// MOCK DATA SERVICE — Development-only implementation
// Uses localStorage for persistence. Implements the same
// service interfaces that the Java Spring Boot REST API
// will satisfy. This module is isolated and can be removed
// once the real backend is connected.
// ============================================================

const STORAGE_KEYS = {
  USERS: 'biz_users',
  BUSINESSES: 'biz_businesses',
  LISTINGS: 'biz_listings',
  REQUESTS: 'biz_requests',
  SESSION: 'biz_session',
  INITIALIZED: 'biz_initialized',
};

type StoredUser = User & { password: string };

function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function initializeData(): void {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!initialized) {
    writeToStorage(STORAGE_KEYS.USERS, SEED_USERS);
    writeToStorage(STORAGE_KEYS.BUSINESSES, SEED_BUSINESSES);
    writeToStorage(STORAGE_KEYS.LISTINGS, SEED_LISTINGS);
    writeToStorage(STORAGE_KEYS.REQUESTS, SEED_REQUESTS);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

export function resetData(): void {
  writeToStorage(STORAGE_KEYS.USERS, SEED_USERS);
  writeToStorage(STORAGE_KEYS.BUSINESSES, SEED_BUSINESSES);
  writeToStorage(STORAGE_KEYS.LISTINGS, SEED_LISTINGS);
  writeToStorage(STORAGE_KEYS.REQUESTS, SEED_REQUESTS);
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
}

function getUsers(): StoredUser[] {
  return readFromStorage(STORAGE_KEYS.USERS, SEED_USERS);
}

function getBusinesses(): Business[] {
  return readFromStorage(STORAGE_KEYS.BUSINESSES, SEED_BUSINESSES);
}

function getListings(): Listing[] {
  return readFromStorage(STORAGE_KEYS.LISTINGS, SEED_LISTINGS);
}

function getRequests(): ExchangeRequest[] {
  return readFromStorage(STORAGE_KEYS.REQUESTS, SEED_REQUESTS);
}

function saveListings(listings: Listing[]): void {
  writeToStorage(STORAGE_KEYS.LISTINGS, listings);
}

function saveRequests(requests: ExchangeRequest[]): void {
  writeToStorage(STORAGE_KEYS.REQUESTS, requests);
}

function saveBusinesses(businesses: Business[]): void {
  writeToStorage(STORAGE_KEYS.BUSINESSES, businesses);
}

function getBusinessForUser(userId: string): Business | undefined {
  return getBusinesses().find((b) => b.userId === userId);
}

// ============================================================
// AUTH SERVICE (mock)
// ============================================================

export const mockAuthService = {
  async login(req: LoginRequest): Promise<{ token: string; user: User; business: Business }> {
    await delay();
    const users = getUsers();
    const found = users.find((u) => u.email.toLowerCase() === req.email.toLowerCase() && u.password === req.password);
    if (!found) throw new Error('Invalid email or password');
    const business = getBusinessForUser(found.userId);
    if (!business) throw new Error('No business profile found for this account');
    const { password: _pw, ...userWithoutPassword } = found;
    const token = `mock_token_${found.userId}_${Date.now()}`;
    const session = { token, user: userWithoutPassword, business };
    writeToStorage(STORAGE_KEYS.SESSION, session);
    return session;
  },

  async register(req: RegisterRequest): Promise<{ token: string; user: User; business: Business }> {
    await delay();
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === req.email.toLowerCase())) {
      throw new Error('An account with this email already exists');
    }
    const userId = generateId('usr');
    const businessId = generateId('biz');
    const now = new Date().toISOString();
    const newUser: StoredUser = {
      userId, fullName: req.fullName, email: req.email, password: req.password, createdAt: now,
    };
    const newBusiness: Business = {
      businessId, userId,
      businessName: req.businessName,
      businessType: req.businessType,
      location: req.location,
      contactNumber: req.contactNumber,
      description: '',
      createdAt: now,
    };
    users.push(newUser);
    const businesses = getBusinesses();
    businesses.push(newBusiness);
    writeToStorage(STORAGE_KEYS.USERS, users);
    writeToStorage(STORAGE_KEYS.BUSINESSES, businesses);
    const { password: _pw, ...userWithoutPassword } = newUser;
    const token = `mock_token_${userId}_${Date.now()}`;
    const session = { token, user: userWithoutPassword, business: newBusiness };
    writeToStorage(STORAGE_KEYS.SESSION, session);
    return session;
  },

  getCurrentSession(): { token: string; user: User; business: Business } | null {
    return readFromStorage(STORAGE_KEYS.SESSION, null);
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  async updateBusiness(businessId: string, updates: Partial<Business>): Promise<Business> {
    const businesses = getBusinesses();
    const idx = businesses.findIndex((b) => b.businessId === businessId);
    if (idx === -1) throw new Error('Business not found');
    businesses[idx] = { ...businesses[idx], ...updates, businessId: businesses[idx].businessId };
    saveBusinesses(businesses);
    const session = this.getCurrentSession();
    if (session && session.business.businessId === businessId) {
      writeToStorage(STORAGE_KEYS.SESSION, { ...session, business: businesses[idx] });
    }
    return businesses[idx];
  },
};

// ============================================================
// LISTING SERVICE (mock)
// ============================================================

export const mockListingService = {
  async getAll(): Promise<Listing[]> {
    await delay();
    return getListings().filter((l) => l.isActive).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getById(id: string): Promise<Listing | null> {
    await delay();
    const listing = getListings().find((l) => l.listingId === id);
    return listing ?? null;
  },

  async getByBusiness(businessId: string): Promise<Listing[]> {
    await delay();
    return getListings()
      .filter((l) => l.businessId === businessId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async create(req: CreateListingRequest, business: Business): Promise<Listing> {
    await delay();
    const listings = getListings();
    const newListing: Listing = {
      listingId: generateId('lst'),
      businessId: business.businessId,
      businessName: business.businessName,
      businessLocation: business.location,
      listingType: req.listingType,
      productName: req.productName,
      category: req.category,
      description: req.description,
      quantity: req.quantity,
      unit: req.unit,
      price: req.price,
      location: req.location,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    listings.push(newListing);
    saveListings(listings);
    return newListing;
  },

  async update(id: string, updates: Partial<CreateListingRequest>): Promise<Listing> {
    await delay();
    const listings = getListings();
    const idx = listings.findIndex((l) => l.listingId === id);
    if (idx === -1) throw new Error('Listing not found');
    listings[idx] = { ...listings[idx], ...updates, listingId: id };
    saveListings(listings);
    return listings[idx];
  },

  async delete(id: string): Promise<void> {
    await delay();
    const listings = getListings();
    const idx = listings.findIndex((l) => l.listingId === id);
    if (idx === -1) throw new Error('Listing not found');
    listings[idx].isActive = false;
    saveListings(listings);
  },
};

// ============================================================
// BUSINESS SERVICE (mock)
// ============================================================

export const mockBusinessService = {
  async getById(id: string): Promise<Business | null> {
    await delay();
    return getBusinesses().find((b) => b.businessId === id) ?? null;
  },

  async getListingsForBusiness(businessId: string): Promise<Listing[]> {
    return mockListingService.getByBusiness(businessId);
  },
};

// ============================================================
// REQUEST SERVICE (mock)
// ============================================================

export const mockRequestService = {
  async create(input: CreateRequestInput, requesterBusiness: Business): Promise<ExchangeRequest> {
    await delay();
    const listings = getListings();
    const listing = listings.find((l) => l.listingId === input.listingId);
    if (!listing) throw new Error('Listing not found');
    if (listing.businessId === requesterBusiness.businessId) {
      throw new Error('Cannot send a request to your own listing');
    }
    if (input.requestedQuantity <= 0) throw new Error('Requested quantity must be greater than zero');
    if (input.offerPrice < 0) throw new Error('Offer price cannot be negative');
    const requests = getRequests();
    const newRequest: ExchangeRequest = {
      requestId: generateId('req'),
      listingId: listing.listingId,
      listingProductName: listing.productName,
      listingType: listing.listingType,
      listingBusinessId: listing.businessId,
      listingBusinessName: listing.businessName,
      requesterBusinessId: requesterBusiness.businessId,
      requesterBusinessName: requesterBusiness.businessName,
      requesterContactNumber: requesterBusiness.contactNumber,
      requestedQuantity: input.requestedQuantity,
      unit: listing.unit,
      offerPrice: input.offerPrice,
      message: input.message ?? '',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    requests.push(newRequest);
    saveRequests(requests);
    return newRequest;
  },

  async getSent(businessId: string): Promise<ExchangeRequest[]> {
    await delay();
    return getRequests()
      .filter((r) => r.requesterBusinessId === businessId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getReceived(businessId: string): Promise<ExchangeRequest[]> {
    await delay();
    return getRequests()
      .filter((r) => r.listingBusinessId === businessId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async updateStatus(requestId: string, status: RequestStatus, currentBusinessId: string): Promise<ExchangeRequest> {
    await delay();
    const requests = getRequests();
    const idx = requests.findIndex((r) => r.requestId === requestId);
    if (idx === -1) throw new Error('Request not found');
    if (requests[idx].listingBusinessId !== currentBusinessId) {
      throw new Error('You are not authorized to update this request');
    }
    requests[idx].status = status;
    saveRequests(requests);
    return requests[idx];
  },
};

// ============================================================
// MATCH SERVICE (mock)
// ============================================================

export const mockMatchService = {
  async findMatches(listingId: string, filters?: MatchFilters): Promise<MatchResult[]> {
    await delay();
    const listings = getListings();
    const sourceListing = listings.find((l) => l.listingId === listingId);
    if (!sourceListing) throw new Error('Listing not found');
    const results = matchListings(sourceListing, listings, filters);
    return results;
  },
};

// ============================================================
// DASHBOARD SERVICE (mock)
// ============================================================

export const mockDashboardService = {
  async getSummary(businessId: string): Promise<DashboardSummary> {
    await delay();
    const allListings = getListings();
    const allRequests = getRequests();
    const myListings = allListings.filter((l) => l.businessId === businessId && l.isActive);
    const needListings = myListings.filter((l) => l.listingType === 'NEED').length;
    const haveListings = myListings.filter((l) => l.listingType === 'HAVE').length;
    const incoming = allRequests.filter((r) => r.listingBusinessId === businessId);
    const outgoing = allRequests.filter((r) => r.requesterBusinessId === businessId);
    const acceptedRequests = incoming.filter((r) => r.status === 'ACCEPTED').length;
    const pendingRequests = incoming.filter((r) => r.status === 'PENDING').length;
    const rejectedRequests = incoming.filter((r) => r.status === 'REJECTED').length;

    const recentListings = myListings.slice(0, 5);

    const activity: ActivityItem[] = [];
    myListings.slice(0, 3).forEach((l) => {
      activity.push({
        id: `act_lst_${l.listingId}`,
        type: 'listing_created',
        message: `Listing "${l.productName}" published`,
        timestamp: l.createdAt,
      });
    });
    outgoing.slice(0, 3).forEach((r) => {
      activity.push({
        id: `act_req_sent_${r.requestId}`,
        type: 'request_sent',
        message: `Request sent to ${r.listingBusinessName} for ${r.listingProductName}`,
        timestamp: r.createdAt,
      });
    });
    incoming.slice(0, 3).forEach((r) => {
      activity.push({
        id: `act_req_rcv_${r.requestId}`,
        type: 'request_received',
        message: `Request received from ${r.requesterBusinessName} for ${r.listingProductName}`,
        timestamp: r.createdAt,
      });
    });
    activity.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    const categoryMap = new Map<ProductCategory, number>();
    allListings.filter((l) => l.isActive).forEach((l) => {
      categoryMap.set(l.category, (categoryMap.get(l.category) ?? 0) + 1);
    });
    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    const allNeed = allListings.filter((l) => l.isActive && l.listingType === 'NEED').length;
    const allHave = allListings.filter((l) => l.isActive && l.listingType === 'HAVE').length;

    const topCategories = categoryBreakdown.slice(0, 5);

    return {
      totalActiveListings: myListings.length,
      needListings,
      haveListings,
      incomingRequests: incoming.length,
      outgoingRequests: outgoing.length,
      acceptedRequests,
      pendingRequests,
      rejectedRequests,
      recentListings,
      recentActivity: activity.slice(0, 8),
      categoryBreakdown,
      needVsHave: { need: allNeed, have: allHave },
      requestStatusBreakdown: { pending: pendingRequests, accepted: acceptedRequests, rejected: rejectedRequests },
      topCategories,
    };
  },
};

// ============================================================
// DEMO UTILITIES
// ============================================================

export const mockDemoService = {
  async reset(): Promise<void> {
    await delay();
    resetData();
  },
};

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
