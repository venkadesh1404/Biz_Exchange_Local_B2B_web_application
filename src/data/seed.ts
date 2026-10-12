import type { User, Business, Listing, ExchangeRequest } from '@/types';

// ============================================================
// SEED DATA — Fictional demo records for BIZ EXCHANGE
// All data is fabricated for demonstration purposes.
// ============================================================

const now = new Date();
const daysAgo = (days: number, hours = 0): string => {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
};

export const SEED_USERS: (User & { password: string })[] = [
  { userId: 'usr_001', fullName: 'Ramesh Kumar', email: 'ramesh@kongucotton.com', password: 'demo123', createdAt: daysAgo(30) },
  { userId: 'usr_002', fullName: 'Priya Sundaram', email: 'priya@tiruppurgarments.com', password: 'demo123', createdAt: daysAgo(28) },
  { userId: 'usr_003', fullName: 'Suresh Pandian', email: 'suresh@deltapaddy.com', password: 'demo123', createdAt: daysAgo(25) },
  { userId: 'usr_004', fullName: 'Lakshmi Nair', email: 'lakshmi@pollachiagro.com', password: 'demo123', createdAt: daysAgo(22) },
  { userId: 'usr_005', fullName: 'Karthik Raj', email: 'karthik@cwbcomponents.com', password: 'demo123', createdAt: daysAgo(20) },
  { userId: 'usr_006', fullName: 'Deepa Krishnan', email: 'deepa@erodetextile.com', password: 'demo123', createdAt: daysAgo(18) },
  { userId: 'usr_007', fullName: 'Murugan S', email: 'murugan@salemgrains.com', password: 'demo123', createdAt: daysAgo(15) },
  { userId: 'usr_008', fullName: 'Anitha R', email: 'anitha@tirunelvelispices.com', password: 'demo123', createdAt: daysAgo(12) },
  { userId: 'usr_009', fullName: 'Vijay Prakash', email: 'vijay@maduraipaper.com', password: 'demo123', createdAt: daysAgo(10) },
  { userId: 'usr_010', fullName: 'Saravanan M', email: 'saravanan@coimbatorewholesale.com', password: 'demo123', createdAt: daysAgo(8) },
  { userId: 'usr_011', fullName: 'Kavitha Senthil', email: 'kavitha@tvlgarments.com', password: 'demo123', createdAt: daysAgo(6) },
  { userId: 'usr_012', fullName: 'Arjun V', email: 'arjun@thanjavurfoods.com', password: 'demo123', createdAt: daysAgo(4) },
];

export const SEED_BUSINESSES: Business[] = [
  {
    businessId: 'biz_001', userId: 'usr_001',
    businessName: 'Kongu Cotton Traders',
    businessType: 'Cotton Trader',
    location: 'Erode',
    contactNumber: '9843012345',
    description: 'Leading cotton trader in the Kongu region dealing in raw cotton, cotton yarn, and cotton fabric. Serving textile mills across Tamil Nadu for over 15 years.',
    createdAt: daysAgo(30),
  },
  {
    businessId: 'biz_002', userId: 'usr_002',
    businessName: 'Tiruppur Garments Hub',
    businessType: 'Clothing Wholesaler',
    location: 'Tiruppur',
    contactNumber: '9843022345',
    description: 'Garment manufacturing and wholesale hub specializing in boys T-shirts, printed apparel, and knit fabric. Bulk orders and export surplus available.',
    createdAt: daysAgo(28),
  },
  {
    businessId: 'biz_003', userId: 'usr_003',
    businessName: 'Delta Paddy Traders',
    businessType: 'Rice Mill',
    location: 'Thanjavur',
    contactNumber: '9843032345',
    description: 'Rice mill and paddy trader from the rice bowl of Tamil Nadu. Processing and supplying raw paddy, Ponni rice, and broken rice for livestock feed.',
    createdAt: daysAgo(25),
  },
  {
    businessId: 'biz_004', userId: 'usr_004',
    businessName: 'Pollachi Agro Mart',
    businessType: 'Agricultural Supplier',
    location: 'Pollachi',
    contactNumber: '9843042345',
    description: 'Agricultural products supplier dealing in turmeric, groundnut, coconut, and organic manure. Direct from farms in the Pollachi belt.',
    createdAt: daysAgo(22),
  },
  {
    businessId: 'biz_005', userId: 'usr_005',
    businessName: 'Coimbatore Wholesale Components',
    businessType: 'Wholesale Supplier',
    location: 'Coimbatore',
    contactNumber: '9843052345',
    description: 'Wholesale supplier of packaging components, storage containers, electrical connectors, and industrial supplies across Coimbatore and Salem.',
    createdAt: daysAgo(20),
  },
  {
    businessId: 'biz_006', userId: 'usr_006',
    businessName: 'Erode Textile Supply',
    businessType: 'Textile Business',
    location: 'Erode',
    contactNumber: '9843062345',
    description: 'Textile supply business dealing in cotton fabric rolls, textile waste cotton, and recycled cotton materials. Supplying garment units in Tiruppur and Coimbatore.',
    createdAt: daysAgo(18),
  },
  {
    businessId: 'biz_007', userId: 'usr_007',
    businessName: 'Salem Grains & Mills',
    businessType: 'Distributor',
    location: 'Salem',
    contactNumber: '9843072345',
    description: 'Grain distributor and miller dealing in wheat, maize, millets, and broken rice for feed production. Serving bakeries and poultry farms.',
    createdAt: daysAgo(15),
  },
  {
    businessId: 'biz_008', userId: 'usr_008',
    businessName: 'Tirunelveli Spices Trading',
    businessType: 'Distributor',
    location: 'Tirunelveli',
    contactNumber: '9843082345',
    description: 'Spice trading company sourcing and distributing red chili, coriander, black pepper, and groundnut from southern Tamil Nadu farms.',
    createdAt: daysAgo(12),
  },
  {
    businessId: 'biz_009', userId: 'usr_009',
    businessName: 'Madurai Paper Products',
    businessType: 'Manufacturer',
    location: 'Madurai',
    contactNumber: '9843092345',
    description: 'Paper product manufacturer producing kraft paper, paper bags, and paper boards for packaging needs. Eco-friendly and recyclable solutions.',
    createdAt: daysAgo(10),
  },
  {
    businessId: 'biz_010', userId: 'usr_010',
    businessName: 'Coimbatore Wholesale Distributors',
    businessType: 'Distributor',
    location: 'Coimbatore',
    contactNumber: '9843102345',
    description: 'General wholesale distributor dealing in packaging materials, storage containers, and agricultural inputs across the Kongu belt.',
    createdAt: daysAgo(8),
  },
  {
    businessId: 'biz_011', userId: 'usr_011',
    businessName: 'Tirunelveli Garments',
    businessType: 'Clothing Wholesaler',
    location: 'Tirunelveli',
    contactNumber: '9843112345',
    description: 'Garment wholesaler specializing in plain and printed T-shirts for retail resale. Competitive pricing for bulk orders.',
    createdAt: daysAgo(6),
  },
  {
    businessId: 'biz_012', userId: 'usr_012',
    businessName: 'Thanjavur Foods & Agro',
    businessType: 'Agricultural Supplier',
    location: 'Thanjavur',
    contactNumber: '9843122345',
    description: 'Agricultural products and food grains supplier from the delta region. Dealing in paddy, rice, organic manure, and feed grains.',
    createdAt: daysAgo(4),
  },
];

export const SEED_LISTINGS: Listing[] = [
  // === Cotton & Textile Materials ===
  // 1. HAVE — Raw cotton bales
  { listingId: 'lst_001', businessId: 'biz_001', businessName: 'Kongu Cotton Traders', businessLocation: 'Erode',
    listingType: 'HAVE', productName: 'Raw cotton bales', category: 'Cotton & Textile Materials',
    description: 'Premium quality raw cotton bales sourced from Erode farms. Clean, well-ginned cotton suitable for textile mills. Grade A quality with minimal contamination.',
    quantity: 500, unit: 'kg', price: 68, location: 'Erode', createdAt: daysAgo(14), isActive: true },
  // 2. NEED — Raw cotton for textile production
  { listingId: 'lst_002', businessId: 'biz_002', businessName: 'Tiruppur Garments Hub', businessLocation: 'Tiruppur',
    listingType: 'NEED', productName: 'Raw cotton for textile production', category: 'Cotton & Textile Materials',
    description: 'Looking for quality raw cotton for our textile production unit. Need consistent supply of ginned cotton for yarn spinning.',
    quantity: 450, unit: 'kg', price: 70, location: 'Tiruppur', createdAt: daysAgo(13), isActive: true },
  // 3. HAVE — Cotton yarn 30s count
  { listingId: 'lst_003', businessId: 'biz_001', businessName: 'Kongu Cotton Traders', businessLocation: 'Erode',
    listingType: 'HAVE', productName: 'Cotton yarn 30s count', category: 'Cotton & Textile Materials',
    description: 'High-quality cotton yarn 30s count suitable for weaving and knitting. Uniform strength and minimal imperfections. Ready for dispatch.',
    quantity: 300, unit: 'kg', price: 185, location: 'Coimbatore', createdAt: daysAgo(12), isActive: true },
  // 4. NEED — Cotton yarn for garment manufacturing
  { listingId: 'lst_004', businessId: 'biz_002', businessName: 'Tiruppur Garments Hub', businessLocation: 'Tiruppur',
    listingType: 'NEED', productName: 'Cotton yarn for garment manufacturing', category: 'Cotton & Textile Materials',
    description: 'Require cotton yarn for garment manufacturing. Prefer 30s or 40s count for T-shirt production. Regular monthly requirement.',
    quantity: 250, unit: 'kg', price: 190, location: 'Tiruppur', createdAt: daysAgo(11), isActive: true },
  // 5. HAVE — Cotton fabric rolls
  { listingId: 'lst_005', businessId: 'biz_006', businessName: 'Erode Textile Supply', businessLocation: 'Erode',
    listingType: 'HAVE', productName: 'Cotton fabric rolls', category: 'Cotton & Textile Materials',
    description: 'Bleached and unbleached cotton fabric rolls available in various widths. Suitable for shirt production and home textiles.',
    quantity: 1000, unit: 'metres', price: 55, location: 'Erode', createdAt: daysAgo(10), isActive: true },
  // 6. NEED — Cotton fabric for shirt production
  { listingId: 'lst_006', businessId: 'biz_010', businessName: 'Coimbatore Wholesale Distributors', businessLocation: 'Coimbatore',
    listingType: 'NEED', productName: 'Cotton fabric for shirt production', category: 'Cotton & Textile Materials',
    description: 'Looking for cotton fabric rolls for shirt manufacturing unit. Need good quality woven fabric in standard widths.',
    quantity: 700, unit: 'metres', price: 60, location: 'Coimbatore', createdAt: daysAgo(9), isActive: true },
  // 7. HAVE — Textile waste cotton
  { listingId: 'lst_007', businessId: 'biz_006', businessName: 'Erode Textile Supply', businessLocation: 'Erode',
    listingType: 'HAVE', productName: 'Textile waste cotton', category: 'Cotton & Textile Materials',
    description: 'Recyclable textile waste cotton from processing units. Suitable for cleaning, stuffing, and recycled yarn production.',
    quantity: 200, unit: 'kg', price: 22, location: 'Tiruppur', createdAt: daysAgo(8), isActive: true },
  // 8. NEED — Recyclable cotton waste for processing
  { listingId: 'lst_008', businessId: 'biz_001', businessName: 'Kongu Cotton Traders', businessLocation: 'Erode',
    listingType: 'NEED', productName: 'Recyclable cotton waste for processing', category: 'Cotton & Textile Materials',
    description: 'Need recyclable cotton waste for our recycling and reprocessing unit. Will collect from nearby locations.',
    quantity: 150, unit: 'kg', price: 25, location: 'Erode', createdAt: daysAgo(7), isActive: true },

  // === Boys' T-Shirts & Garments ===
  // 9. HAVE — Boys cotton T-shirts assorted
  { listingId: 'lst_009', businessId: 'biz_002', businessName: 'Tiruppur Garments Hub', businessLocation: 'Tiruppur',
    listingType: 'HAVE', productName: 'Boys cotton T-shirts assorted sizes', category: "Boys' T-Shirts & Garments",
    description: 'Assorted sizes boys cotton T-shirts in various colors. Good quality fabric, ready for retail. Sizes 4-14 years.',
    quantity: 500, unit: 'pieces', price: 95, location: 'Tiruppur', createdAt: daysAgo(14), isActive: true },
  // 10. NEED — Plain boys T-shirts for printing
  { listingId: 'lst_010', businessId: 'biz_010', businessName: 'Coimbatore Wholesale Distributors', businessLocation: 'Coimbatore',
    listingType: 'NEED', productName: 'Plain boys T-shirts for printing', category: "Boys' T-Shirts & Garments",
    description: 'Looking for plain cotton T-shirts suitable for screen printing and custom printing. White and light colors preferred.',
    quantity: 400, unit: 'pieces', price: 100, location: 'Coimbatore', createdAt: daysAgo(13), isActive: true },
  // 11. HAVE — Printed boys T-shirts
  { listingId: 'lst_011', businessId: 'biz_011', businessName: 'Tirunelveli Garments', businessLocation: 'Tirunelveli',
    listingType: 'HAVE', productName: 'Printed boys T-shirts', category: "Boys' T-Shirts & Garments",
    description: 'Fashionable printed T-shirts for boys. Trendy designs, good quality prints. Ready for retail resale.',
    quantity: 250, unit: 'pieces', price: 140, location: 'Tirunelveli', createdAt: daysAgo(12), isActive: true },
  // 12. NEED — Printed T-shirts for retail resale
  { listingId: 'lst_012', businessId: 'biz_006', businessName: 'Erode Textile Supply', businessLocation: 'Erode',
    listingType: 'NEED', productName: 'Printed T-shirts for retail resale', category: "Boys' T-Shirts & Garments",
    description: 'Need printed T-shirts for our retail outlets. Looking for trendy designs in various sizes for the season.',
    quantity: 200, unit: 'pieces', price: 150, location: 'Erode', createdAt: daysAgo(11), isActive: true },
  // 13. HAVE — Plain cotton T-shirt fabric
  { listingId: 'lst_013', businessId: 'biz_002', businessName: 'Tiruppur Garments Hub', businessLocation: 'Tiruppur',
    listingType: 'HAVE', productName: 'Plain cotton T-shirt fabric', category: "Boys' T-Shirts & Garments",
    description: 'Cotton knit fabric suitable for T-shirt manufacturing. Single jersey, 180 GSM. Available in multiple colors.',
    quantity: 600, unit: 'metres', price: 75, location: 'Tiruppur', createdAt: daysAgo(10), isActive: true },
  // 14. NEED — Cotton knit fabric for garment production
  { listingId: 'lst_014', businessId: 'biz_011', businessName: 'Tirunelveli Garments', businessLocation: 'Tirunelveli',
    listingType: 'NEED', productName: 'Cotton knit fabric for garment production', category: "Boys' T-Shirts & Garments",
    description: 'Require cotton knit fabric for our garment production unit. Single jersey, 180-200 GSM for T-shirt manufacturing.',
    quantity: 500, unit: 'metres', price: 80, location: 'Coimbatore', createdAt: daysAgo(9), isActive: true },
  // 15. HAVE — Garment surplus stock
  { listingId: 'lst_015', businessId: 'biz_002', businessName: 'Tiruppur Garments Hub', businessLocation: 'Tiruppur',
    listingType: 'HAVE', productName: 'Garment surplus stock', category: "Boys' T-Shirts & Garments",
    description: 'Export surplus garments and factory overstock. Mixed sizes and styles. Suitable for discount retail and wholesale.',
    quantity: 150, unit: 'pieces', price: 85, location: 'Salem', createdAt: daysAgo(8), isActive: true },

  // === Wholesale Components & Packaging ===
  // 16. HAVE — Corrugated cardboard boxes
  { listingId: 'lst_016', businessId: 'biz_005', businessName: 'Coimbatore Wholesale Components', businessLocation: 'Coimbatore',
    listingType: 'HAVE', productName: 'Corrugated cardboard boxes', category: 'Wholesale Components & Packaging',
    description: 'Strong corrugated cardboard boxes in various sizes. Suitable for shipping, packaging, and storage. Bulk quantities available.',
    quantity: 1000, unit: 'pieces', price: 18, location: 'Coimbatore', createdAt: daysAgo(14), isActive: true },
  // 17. NEED — Cardboard packaging cartons
  { listingId: 'lst_017', businessId: 'biz_002', businessName: 'Tiruppur Garments Hub', businessLocation: 'Tiruppur',
    listingType: 'NEED', productName: 'Cardboard packaging cartons', category: 'Wholesale Components & Packaging',
    description: 'Need cardboard packaging cartons for garment dispatch. Standard sizes for T-shirt packing and wholesale shipping.',
    quantity: 800, unit: 'pieces', price: 20, location: 'Tiruppur', createdAt: daysAgo(13), isActive: true },
  // 18. HAVE — Plastic storage containers
  { listingId: 'lst_018', businessId: 'biz_005', businessName: 'Coimbatore Wholesale Components', businessLocation: 'Coimbatore',
    listingType: 'HAVE', productName: 'Plastic storage containers', category: 'Wholesale Components & Packaging',
    description: 'Durable plastic storage containers in various sizes. Food-grade quality. Suitable for storage and transport.',
    quantity: 300, unit: 'pieces', price: 45, location: 'Erode', createdAt: daysAgo(12), isActive: true },
  // 19. NEED — Bulk storage containers
  { listingId: 'lst_019', businessId: 'biz_010', businessName: 'Coimbatore Wholesale Distributors', businessLocation: 'Coimbatore',
    listingType: 'NEED', productName: 'Bulk storage containers', category: 'Wholesale Components & Packaging',
    description: 'Looking for bulk storage containers for warehouse organization. Need sturdy containers for inventory management.',
    quantity: 250, unit: 'pieces', price: 50, location: 'Coimbatore', createdAt: daysAgo(11), isActive: true },
  // 20. HAVE — Industrial packaging tape
  { listingId: 'lst_020', businessId: 'biz_005', businessName: 'Coimbatore Wholesale Components', businessLocation: 'Coimbatore',
    listingType: 'HAVE', productName: 'Industrial packaging tape', category: 'Wholesale Components & Packaging',
    description: 'BOPP industrial packaging tape for carton sealing. Strong adhesive, 48mm width. Available in clear and brown.',
    quantity: 200, unit: 'rolls', price: 28, location: 'Coimbatore', createdAt: daysAgo(10), isActive: true },
  // 21. NEED — Packing tape for wholesale dispatch
  { listingId: 'lst_021', businessId: 'biz_007', businessName: 'Salem Grains & Mills', businessLocation: 'Salem',
    listingType: 'NEED', productName: 'Packing tape for wholesale dispatch', category: 'Wholesale Components & Packaging',
    description: 'Need packing tape for our wholesale grain dispatch operations. BOPP tape preferred for carton sealing.',
    quantity: 150, unit: 'rolls', price: 30, location: 'Salem', createdAt: daysAgo(9), isActive: true },
  // 22. HAVE — Small electrical connectors
  { listingId: 'lst_022', businessId: 'biz_005', businessName: 'Coimbatore Wholesale Components', businessLocation: 'Coimbatore',
    listingType: 'HAVE', productName: 'Small electrical connectors', category: 'Wholesale Components & Packaging',
    description: 'Electrical connectors suitable for assembly and wiring. Various pin configurations. Bulk pricing available.',
    quantity: 1000, unit: 'pieces', price: 6, location: 'Coimbatore', createdAt: daysAgo(8), isActive: true },
  // 23. NEED — Electrical connectors for assembly
  { listingId: 'lst_023', businessId: 'biz_007', businessName: 'Salem Grains & Mills', businessLocation: 'Salem',
    listingType: 'NEED', productName: 'Electrical connectors for assembly', category: 'Wholesale Components & Packaging',
    description: 'Need small electrical connectors for our equipment assembly line. Standard pin types for industrial wiring.',
    quantity: 800, unit: 'pieces', price: 7, location: 'Salem', createdAt: daysAgo(7), isActive: true },

  // === Rice & Paddy ===
  // 24. HAVE — Raw paddy
  { listingId: 'lst_024', businessId: 'biz_003', businessName: 'Delta Paddy Traders', businessLocation: 'Thanjavur',
    listingType: 'HAVE', productName: 'Raw paddy', category: 'Rice & Paddy',
    description: 'Freshly harvested raw paddy from Thanjavur delta fields. Good quality grain suitable for rice milling.',
    quantity: 2000, unit: 'kg', price: 24, location: 'Thanjavur', createdAt: daysAgo(14), isActive: true },
  // 25. NEED — Raw paddy for rice milling
  { listingId: 'lst_025', businessId: 'biz_012', businessName: 'Thanjavur Foods & Agro', businessLocation: 'Thanjavur',
    listingType: 'NEED', productName: 'Raw paddy for rice milling', category: 'Rice & Paddy',
    description: 'Require raw paddy for our rice milling unit. Regular monthly requirement. Will arrange transport from nearby locations.',
    quantity: 1500, unit: 'kg', price: 25, location: 'Thanjavur', createdAt: daysAgo(13), isActive: true },
  // 26. HAVE — Ponni rice
  { listingId: 'lst_026', businessId: 'biz_003', businessName: 'Delta Paddy Traders', businessLocation: 'Thanjavur',
    listingType: 'HAVE', productName: 'Ponni rice', category: 'Rice & Paddy',
    description: 'Quality Ponni rice from Thanjavur. Well-milled, clean grains. Suitable for wholesale distribution and retail.',
    quantity: 1000, unit: 'kg', price: 48, location: 'Coimbatore', createdAt: daysAgo(12), isActive: true },
  // 27. NEED — Ponni rice for wholesale distribution
  { listingId: 'lst_027', businessId: 'biz_010', businessName: 'Coimbatore Wholesale Distributors', businessLocation: 'Coimbatore',
    listingType: 'NEED', productName: 'Ponni rice for wholesale distribution', category: 'Rice & Paddy',
    description: 'Need Ponni rice for our wholesale distribution network. Good quality, well-milled rice for retail supply.',
    quantity: 800, unit: 'kg', price: 50, location: 'Erode', createdAt: daysAgo(11), isActive: true },
  // 28. HAVE — Broken rice for livestock feed
  { listingId: 'lst_028', businessId: 'biz_003', businessName: 'Delta Paddy Traders', businessLocation: 'Thanjavur',
    listingType: 'HAVE', productName: 'Broken rice for livestock feed', category: 'Rice & Paddy',
    description: 'Broken rice suitable for livestock feed and poultry feed manufacturing. Clean, processed broken grains.',
    quantity: 500, unit: 'kg', price: 22, location: 'Thanjavur', createdAt: daysAgo(10), isActive: true },
  // 29. NEED — Broken rice for feed production
  { listingId: 'lst_029', businessId: 'biz_007', businessName: 'Salem Grains & Mills', businessLocation: 'Salem',
    listingType: 'NEED', productName: 'Broken rice for feed production', category: 'Rice & Paddy',
    description: 'Need broken rice for our animal feed production unit. Regular supply required for poultry feed manufacturing.',
    quantity: 400, unit: 'kg', price: 24, location: 'Salem', createdAt: daysAgo(9), isActive: true },

  // === Agricultural Products ===
  // 30. HAVE — Turmeric fingers
  { listingId: 'lst_030', businessId: 'biz_004', businessName: 'Pollachi Agro Mart', businessLocation: 'Pollachi',
    listingType: 'HAVE', productName: 'Turmeric fingers', category: 'Agricultural Products',
    description: 'Dried turmeric fingers from Erode region farms. High curcumin content, well-dried and cleaned. Suitable for wholesale trade.',
    quantity: 500, unit: 'kg', price: 120, location: 'Erode', createdAt: daysAgo(14), isActive: true },
  // 31. NEED — Dried turmeric for wholesale trade
  { listingId: 'lst_031', businessId: 'biz_010', businessName: 'Coimbatore Wholesale Distributors', businessLocation: 'Coimbatore',
    listingType: 'NEED', productName: 'Dried turmeric for wholesale trade', category: 'Agricultural Products',
    description: 'Looking for quality dried turmeric for our wholesale spice trading business. High curcumin variety preferred.',
    quantity: 300, unit: 'kg', price: 125, location: 'Coimbatore', createdAt: daysAgo(13), isActive: true },
  // 32. HAVE — Groundnut
  { listingId: 'lst_032', businessId: 'biz_008', businessName: 'Tirunelveli Spices Trading', businessLocation: 'Tirunelveli',
    listingType: 'HAVE', productName: 'Groundnut', category: 'Agricultural Products',
    description: 'Quality groundnut from Tirunelveli farms. Well-dried, clean kernels. Suitable for oil processing and wholesale.',
    quantity: 700, unit: 'kg', price: 75, location: 'Tirunelveli', createdAt: daysAgo(12), isActive: true },
  // 33. NEED — Groundnut for oil processing
  { listingId: 'lst_033', businessId: 'biz_004', businessName: 'Pollachi Agro Mart', businessLocation: 'Pollachi',
    listingType: 'NEED', productName: 'Groundnut for oil processing', category: 'Agricultural Products',
    description: 'Need groundnut for our oil processing unit. Good quality kernels with high oil content required.',
    quantity: 600, unit: 'kg', price: 78, location: 'Tirunelveli', createdAt: daysAgo(11), isActive: true },
  // 34. HAVE — Coconut
  { listingId: 'lst_034', businessId: 'biz_004', businessName: 'Pollachi Agro Mart', businessLocation: 'Pollachi',
    listingType: 'HAVE', productName: 'Coconut', category: 'Agricultural Products',
    description: 'Mature coconuts from Pollachi farms. Good quality, well-sized nuts. Suitable for wholesale supply and retail.',
    quantity: 1000, unit: 'pieces', price: 28, location: 'Pollachi', createdAt: daysAgo(10), isActive: true },
  // 35. NEED — Mature coconuts for wholesale supply
  { listingId: 'lst_035', businessId: 'biz_010', businessName: 'Coimbatore Wholesale Distributors', businessLocation: 'Coimbatore',
    listingType: 'NEED', productName: 'Mature coconuts for wholesale supply', category: 'Agricultural Products',
    description: 'Looking for mature coconuts for our wholesale distribution. Need good quality, well-sized nuts for retail supply.',
    quantity: 800, unit: 'pieces', price: 30, location: 'Coimbatore', createdAt: daysAgo(9), isActive: true },
  // 36. HAVE — Organic manure
  { listingId: 'lst_036', businessId: 'biz_012', businessName: 'Thanjavur Foods & Agro', businessLocation: 'Thanjavur',
    listingType: 'HAVE', productName: 'Organic manure', category: 'Agricultural Products',
    description: 'Organic manure from natural composting. Rich in nutrients, suitable for farming and organic agriculture.',
    quantity: 1000, unit: 'kg', price: 8, location: 'Pollachi', createdAt: daysAgo(8), isActive: true },
  // 37. NEED — Organic manure for farming
  { listingId: 'lst_037', businessId: 'biz_004', businessName: 'Pollachi Agro Mart', businessLocation: 'Pollachi',
    listingType: 'NEED', productName: 'Organic manure for farming', category: 'Agricultural Products',
    description: 'Need organic manure for our farm operations. Looking for quality compost and natural fertilizer for crop cultivation.',
    quantity: 600, unit: 'kg', price: 10, location: 'Erode', createdAt: daysAgo(7), isActive: true },

  // === Grains ===
  // 38. HAVE — Wheat grains
  { listingId: 'lst_038', businessId: 'biz_007', businessName: 'Salem Grains & Mills', businessLocation: 'Salem',
    listingType: 'HAVE', productName: 'Wheat grains', category: 'Grains',
    description: 'Quality wheat grains suitable for flour milling and bakery use. Clean, well-dried grains from wholesale stocks.',
    quantity: 1500, unit: 'kg', price: 32, location: 'Salem', createdAt: daysAgo(10), isActive: true },
  // 39. NEED — Wheat for flour milling
  { listingId: 'lst_039', businessId: 'biz_012', businessName: 'Thanjavur Foods & Agro', businessLocation: 'Thanjavur',
    listingType: 'NEED', productName: 'Wheat for flour milling', category: 'Grains',
    description: 'Require wheat grains for our flour milling unit. Good quality grains for atta and maida production.',
    quantity: 1200, unit: 'kg', price: 34, location: 'Thanjavur', createdAt: daysAgo(8), isActive: true },
  // 40. HAVE — Maize corn
  { listingId: 'lst_040', businessId: 'biz_007', businessName: 'Salem Grains & Mills', businessLocation: 'Salem',
    listingType: 'HAVE', productName: 'Maize corn', category: 'Grains',
    description: 'Yellow maize corn suitable for poultry feed and food processing. Well-dried, cleaned grains available in bulk.',
    quantity: 2000, unit: 'kg', price: 22, location: 'Salem', createdAt: daysAgo(6), isActive: true },
  // 41. NEED — Millets for wholesale
  { listingId: 'lst_041', businessId: 'biz_004', businessName: 'Pollachi Agro Mart', businessLocation: 'Pollachi',
    listingType: 'NEED', productName: 'Millets for wholesale distribution', category: 'Grains',
    description: 'Looking for ragi, jowar, and other millets for wholesale distribution. Growing demand for millet products in our region.',
    quantity: 500, unit: 'kg', price: 45, location: 'Pollachi', createdAt: daysAgo(5), isActive: true },
  // 42. HAVE — Ragi millet
  { listingId: 'lst_042', businessId: 'biz_012', businessName: 'Thanjavur Foods & Agro', businessLocation: 'Thanjavur',
    listingType: 'HAVE', productName: 'Ragi millet', category: 'Grains',
    description: 'Finger millet (ragi) from delta region farms. Clean, well-dried grains. Suitable for flour production and wholesale.',
    quantity: 600, unit: 'kg', price: 42, location: 'Thanjavur', createdAt: daysAgo(4), isActive: true },

  // === Spices ===
  // 43. HAVE — Red chili
  { listingId: 'lst_043', businessId: 'biz_008', businessName: 'Tirunelveli Spices Trading', businessLocation: 'Tirunelveli',
    listingType: 'HAVE', productName: 'Red chili', category: 'Spices',
    description: 'Dried red chili from Tirunelveli farms. High pungency variety. Well-dried and cleaned for wholesale spice trade.',
    quantity: 400, unit: 'kg', price: 180, location: 'Tirunelveli', createdAt: daysAgo(9), isActive: true },
  // 44. NEED — Dry red chili for spice trade
  { listingId: 'lst_044', businessId: 'biz_010', businessName: 'Coimbatore Wholesale Distributors', businessLocation: 'Coimbatore',
    listingType: 'NEED', productName: 'Dry red chili for spice trade', category: 'Spices',
    description: 'Need dry red chili for our wholesale spice distribution. Looking for high pungency variety in bulk quantities.',
    quantity: 350, unit: 'kg', price: 185, location: 'Coimbatore', createdAt: daysAgo(7), isActive: true },
  // 45. HAVE — Coriander seeds
  { listingId: 'lst_045', businessId: 'biz_008', businessName: 'Tirunelveli Spices Trading', businessLocation: 'Tirunelveli',
    listingType: 'HAVE', productName: 'Coriander seeds', category: 'Spices',
    description: 'Quality coriander seeds (dhania) from southern Tamil Nadu. Well-dried, cleaned seeds. Suitable for spice powder production.',
    quantity: 300, unit: 'kg', price: 130, location: 'Tirunelveli', createdAt: daysAgo(6), isActive: true },
  // 46. NEED — Black pepper for wholesale
  { listingId: 'lst_046', businessId: 'biz_010', businessName: 'Coimbatore Wholesale Distributors', businessLocation: 'Coimbatore',
    listingType: 'NEED', productName: 'Black pepper for wholesale distribution', category: 'Spices',
    description: 'Looking for quality black pepper for our wholesale spice trading. Need well-dried peppercorns for retail supply.',
    quantity: 200, unit: 'kg', price: 520, location: 'Coimbatore', createdAt: daysAgo(5), isActive: true },
  // 47. HAVE — Black pepper
  { listingId: 'lst_047', businessId: 'biz_008', businessName: 'Tirunelveli Spices Trading', businessLocation: 'Tirunelveli',
    listingType: 'HAVE', productName: 'Black pepper', category: 'Spices',
    description: 'Premium black pepper from Kerala-sourced stocks. Well-dried, high piperine content. Suitable for wholesale and retail.',
    quantity: 250, unit: 'kg', price: 500, location: 'Tirunelveli', createdAt: daysAgo(4), isActive: true },

  // === Paper Products ===
  // 48. HAVE — Kraft paper rolls
  { listingId: 'lst_048', businessId: 'biz_009', businessName: 'Madurai Paper Products', businessLocation: 'Madurai',
    listingType: 'HAVE', productName: 'Kraft paper rolls', category: 'Paper Products',
    description: 'Brown kraft paper rolls in various widths and GSM. Suitable for packaging, wrapping, and paper bag manufacturing.',
    quantity: 500, unit: 'rolls', price: 85, location: 'Madurai', createdAt: daysAgo(8), isActive: true },
  // 49. NEED — Craft paper for packaging
  { listingId: 'lst_049', businessId: 'biz_005', businessName: 'Coimbatore Wholesale Components', businessLocation: 'Coimbatore',
    listingType: 'NEED', productName: 'Craft paper for packaging', category: 'Paper Products',
    description: 'Need kraft paper for our packaging operations. Looking for brown wrapping paper rolls for box lining and wrapping.',
    quantity: 400, unit: 'rolls', price: 90, location: 'Coimbatore', createdAt: daysAgo(7), isActive: true },
  // 50. HAVE — Paper bags
  { listingId: 'lst_050', businessId: 'biz_009', businessName: 'Madurai Paper Products', businessLocation: 'Madurai',
    listingType: 'HAVE', productName: 'Paper bags', category: 'Paper Products',
    description: 'Eco-friendly paper bags in various sizes. Suitable for retail, food packaging, and shopping. Custom printing available.',
    quantity: 2000, unit: 'pieces', price: 4, location: 'Madurai', createdAt: daysAgo(5), isActive: true },
  // 51. NEED — Paper bags for retail
  { listingId: 'lst_051', businessId: 'biz_010', businessName: 'Coimbatore Wholesale Distributors', businessLocation: 'Coimbatore',
    listingType: 'NEED', productName: 'Paper bags for retail supply', category: 'Paper Products',
    description: 'Need paper carry bags for our retail distribution. Looking for eco-friendly kraft bags in standard sizes.',
    quantity: 1500, unit: 'pieces', price: 5, location: 'Coimbatore', createdAt: daysAgo(4), isActive: true },
  // 52. HAVE — Paper board sheets
  { listingId: 'lst_052', businessId: 'biz_009', businessName: 'Madurai Paper Products', businessLocation: 'Madurai',
    listingType: 'HAVE', productName: 'Paper board sheets', category: 'Paper Products',
    description: 'Grey board and paper board sheets for packaging, mounting, and box manufacturing. Various thicknesses available.',
    quantity: 800, unit: 'pieces', price: 12, location: 'Madurai', createdAt: daysAgo(3), isActive: true },
];

export const SEED_REQUESTS: ExchangeRequest[] = [
  {
    requestId: 'req_001',
    listingId: 'lst_003',
    listingProductName: 'Cotton yarn 30s count',
    listingType: 'HAVE',
    listingBusinessId: 'biz_001',
    listingBusinessName: 'Kongu Cotton Traders',
    requesterBusinessId: 'biz_002',
    requesterBusinessName: 'Tiruppur Garments Hub',
    requesterContactNumber: '9843022345',
    requestedQuantity: 250,
    unit: 'kg',
    offerPrice: 188,
    message: 'We need cotton yarn 30s for our T-shirt production. Can you supply 250 kg at ₹188/kg? Looking for regular monthly supply.',
    status: 'PENDING',
    createdAt: daysAgo(3),
  },
  {
    requestId: 'req_002',
    listingId: 'lst_026',
    listingProductName: 'Ponni rice',
    listingType: 'HAVE',
    listingBusinessId: 'biz_003',
    listingBusinessName: 'Delta Paddy Traders',
    requesterBusinessId: 'biz_010',
    requesterBusinessName: 'Coimbatore Wholesale Distributors',
    requesterContactNumber: '9843102345',
    requestedQuantity: 800,
    unit: 'kg',
    offerPrice: 49,
    message: 'Interested in your Ponni rice for our wholesale network. Can you supply the full quantity at ₹49/kg?',
    status: 'ACCEPTED',
    createdAt: daysAgo(5),
  },
  {
    requestId: 'req_003',
    listingId: 'lst_034',
    listingProductName: 'Coconut',
    listingType: 'HAVE',
    listingBusinessId: 'biz_004',
    listingBusinessName: 'Pollachi Agro Mart',
    requesterBusinessId: 'biz_010',
    requesterBusinessName: 'Coimbatore Wholesale Distributors',
    requesterContactNumber: '9843102345',
    requestedQuantity: 800,
    unit: 'pieces',
    offerPrice: 29,
    message: 'Need mature coconuts for our retail network. Please confirm availability and delivery timeline.',
    status: 'PENDING',
    createdAt: daysAgo(2),
  },
];

export const DEMO_ACCOUNTS = [
  { email: 'ramesh@kongucotton.com', password: 'demo123', businessName: 'Kongu Cotton Traders', label: 'Cotton Trader' },
  { email: 'priya@tiruppurgarments.com', password: 'demo123', businessName: 'Tiruppur Garments Hub', label: 'Garment Wholesaler' },
  { email: 'suresh@deltapaddy.com', password: 'demo123', businessName: 'Delta Paddy Traders', label: 'Rice Mill' },
  { email: 'lakshmi@pollachiagro.com', password: 'demo123', businessName: 'Pollachi Agro Mart', label: 'Agricultural Supplier' },
  { email: 'karthik@cwbcomponents.com', password: 'demo123', businessName: 'Coimbatore Wholesale Components', label: 'Packaging Wholesaler' },
];
