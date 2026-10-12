// ============================================================
// BIZ EXCHANGE — Type Contracts
// These interfaces define the shape of data returned by the
// service layer. Both the mock data service and the future
// Java Spring Boot REST API must conform to these contracts.
// ============================================================

export type ListingType = 'NEED' | 'HAVE';
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type BusinessType =
  | 'Manufacturer'
  | 'Cotton Trader'
  | 'Textile Business'
  | 'Clothing Wholesaler'
  | 'Retailer'
  | 'Wholesale Supplier'
  | 'Rice Mill'
  | 'Paddy Trader'
  | 'Farmer'
  | 'Agricultural Supplier'
  | 'Distributor'
  | 'Local Trader'
  | 'Other';

export type ProductCategory =
  | 'Cotton & Textile Materials'
  | "Boys' T-Shirts & Garments"
  | 'Wholesale Components & Packaging'
  | 'Rice & Paddy'
  | 'Agricultural Products'
  | 'Grains'
  | 'Spices'
  | 'Paper Products';

export interface User {
  userId: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface Business {
  businessId: string;
  userId: string;
  businessName: string;
  businessType: BusinessType;
  location: string;
  contactNumber: string;
  description: string;
  createdAt: string;
}

export interface Listing {
  listingId: string;
  businessId: string;
  businessName: string;
  businessLocation: string;
  listingType: ListingType;
  productName: string;
  category: ProductCategory;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  createdAt: string;
  isActive: boolean;
}

export interface ExchangeRequest {
  requestId: string;
  listingId: string;
  listingProductName: string;
  listingType: ListingType;
  listingBusinessId: string;
  listingBusinessName: string;
  requesterBusinessId: string;
  requesterBusinessName: string;
  requesterContactNumber: string;
  requestedQuantity: number;
  unit: string;
  offerPrice: number;
  message: string;
  status: RequestStatus;
  createdAt: string;
}

export interface MatchResult {
  listing: Listing;
  score: number;
  matchLabel: 'Strong Match' | 'Good Match' | 'Possible Match';
  explanation: string;
  breakdown: {
    nameScore: number;
    descriptionScore: number;
    categoryScore: number;
    locationScore: number;
    quantityScore: number;
    priceScore: number;
  };
}

export interface DashboardSummary {
  totalActiveListings: number;
  needListings: number;
  haveListings: number;
  incomingRequests: number;
  outgoingRequests: number;
  acceptedRequests: number;
  pendingRequests: number;
  rejectedRequests: number;
  recentListings: Listing[];
  recentActivity: ActivityItem[];
  categoryBreakdown: { category: ProductCategory; count: number }[];
  needVsHave: { need: number; have: number };
  requestStatusBreakdown: { pending: number; accepted: number; rejected: number };
  topCategories: { category: ProductCategory; count: number }[];
}

export interface ActivityItem {
  id: string;
  type: 'listing_created' | 'listing_updated' | 'request_sent' | 'request_received' | 'request_accepted' | 'request_rejected';
  message: string;
  timestamp: string;
}

export interface AuthSession {
  token: string;
  user: User;
  business: Business;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  businessName: string;
  businessType: BusinessType;
  location: string;
  contactNumber: string;
}

export interface CreateListingRequest {
  listingType: ListingType;
  productName: string;
  category: ProductCategory;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
}

export interface CreateRequestInput {
  listingId: string;
  requestedQuantity: number;
  offerPrice: number;
  message?: string;
}

export interface MarketplaceFilters {
  search?: string;
  listingType?: ListingType | 'ALL';
  category?: ProductCategory | 'ALL';
  city?: string | 'ALL';
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  sortBy?: 'newest' | 'relevance';
}

export interface MatchFilters {
  location?: string | 'ALL';
  minQuantity?: number;
  maxPrice?: number;
}

// API response wrapper (matches typical Spring Boot ResponseEntity structure)
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const CATEGORIES: ProductCategory[] = [
  'Cotton & Textile Materials',
  "Boys' T-Shirts & Garments",
  'Wholesale Components & Packaging',
  'Rice & Paddy',
  'Agricultural Products',
  'Grains',
  'Spices',
  'Paper Products',
];

export const BUSINESS_TYPES: BusinessType[] = [
  'Manufacturer',
  'Cotton Trader',
  'Textile Business',
  'Clothing Wholesaler',
  'Retailer',
  'Wholesale Supplier',
  'Rice Mill',
  'Paddy Trader',
  'Farmer',
  'Agricultural Supplier',
  'Distributor',
  'Local Trader',
  'Other',
];

export const LOCATIONS = [
  'Coimbatore',
  'Tiruppur',
  'Erode',
  'Pollachi',
  'Salem',
  'Tirunelveli',
  'Thanjavur',
  'Madurai',
  'Chennai',
  'Other',
];

export const UNITS = ['kg', 'metres', 'pieces', 'rolls', 'litres', 'bags', 'boxes', 'tons'];
