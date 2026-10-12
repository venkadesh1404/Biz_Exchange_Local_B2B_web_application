import type { ProductCategory } from '@/types';

// ============================================================
// Synonym & Semantic Relationship Dictionary
// Used by the AI matching engine to find related products
// even when exact names differ (e.g. "corrugated cardboard
// boxes" matches "cardboard packaging cartons").
// ============================================================

export interface SynonymGroup {
  canonical: string;
  synonyms: string[];
  category: ProductCategory;
}

export const SYNONYM_GROUPS: SynonymGroup[] = [
  // Cotton & Textile Materials
  {
    canonical: 'raw cotton',
    synonyms: ['cotton', 'cotton bales', 'cotton raw', 'unginned cotton', 'kapas', 'cotton fiber'],
    category: 'Cotton & Textile Materials',
  },
  {
    canonical: 'cotton yarn',
    synonyms: ['yarn', 'cotton thread', 'spun yarn', 'yarn 30s', 'yarn 40s', 'cotton spun yarn', 'sewing thread'],
    category: 'Cotton & Textile Materials',
  },
  {
    canonical: 'cotton fabric',
    synonyms: ['fabric', 'cotton cloth', 'cotton rolls', 'woven fabric', 'cotton material', 'greige fabric', 'gray cloth'],
    category: 'Cotton & Textile Materials',
  },
  {
    canonical: 'textile waste',
    synonyms: ['cotton waste', 'recyclable cotton', 'waste cotton', 'textile scraps', 'cotton lint', 'comber noil'],
    category: 'Cotton & Textile Materials',
  },
  // Boys' T-Shirts & Garments
  {
    canonical: 'boys t-shirt',
    synonyms: ['t-shirt', 'tshirt', 'tee', 'boys tee', 'kids t-shirt', 'childrens t-shirt', 'cotton t-shirt', 'plain t-shirt', 'printed t-shirt', 'garment', 'apparel', 'shirt'],
    category: "Boys' T-Shirts & Garments",
  },
  {
    canonical: 'knit fabric',
    synonyms: ['knit fabric', 'cotton knit', 'rib fabric', 'jersey fabric', 't-shirt fabric', 'cotton knit fabric', 'interlock fabric'],
    category: "Boys' T-Shirts & Garments",
  },
  {
    canonical: 'garment surplus',
    synonyms: ['surplus stock', 'excess garments', 'overstock garments', 'stock lot', 'factory surplus', 'reject garments', 'export surplus'],
    category: "Boys' T-Shirts & Garments",
  },
  // Wholesale Components & Packaging
  {
    canonical: 'cardboard box',
    synonyms: ['corrugated box', 'carton', 'cardboard carton', 'packaging box', 'corrugated carton', 'cardboard box', 'shipping box', 'packing box', 'corrugated cardboard box', 'cardboard packaging carton'],
    category: 'Wholesale Components & Packaging',
  },
  {
    canonical: 'storage container',
    synonyms: ['plastic container', 'storage box', 'plastic box', 'bulk container', 'storage bin', 'plastic bin', 'crates'],
    category: 'Wholesale Components & Packaging',
  },
  {
    canonical: 'packaging tape',
    synonyms: ['packing tape', 'tape', 'adhesive tape', 'carton tape', 'box tape', 'sealing tape', 'bopp tape'],
    category: 'Wholesale Components & Packaging',
  },
  {
    canonical: 'electrical connector',
    synonyms: ['connector', 'electrical component', 'wire connector', 'terminal', 'plug connector', 'pin connector', 'electrical fitting'],
    category: 'Wholesale Components & Packaging',
  },
  // Rice & Paddy
  {
    canonical: 'raw paddy',
    synonyms: ['paddy', 'rice paddy', 'unprocessed rice', 'raw rice', 'paddy grain', 'harvested paddy'],
    category: 'Rice & Paddy',
  },
  {
    canonical: 'ponni rice',
    synonyms: ['rice', 'ponni', 'boiled rice', 'white rice', 'sona rice', 'sona masuri', 'idli rice', 'cooked rice'],
    category: 'Rice & Paddy',
  },
  {
    canonical: 'broken rice',
    synonyms: ['broken rice', 'rice bits', 'fragmented rice', 'rice grits', 'feed rice'],
    category: 'Rice & Paddy',
  },
  // Agricultural Products
  {
    canonical: 'turmeric',
    synonyms: ['turmeric fingers', 'turmeric powder', 'haldi', 'curcumin', 'dried turmeric', 'turmeric root', 'manjal'],
    category: 'Agricultural Products',
  },
  {
    canonical: 'groundnut',
    synonyms: ['peanut', 'groundnut', 'ground nut', 'monkey nut', 'kadalekai', 'groundnut kernels'],
    category: 'Agricultural Products',
  },
  {
    canonical: 'coconut',
    synonyms: ['coconut', 'mature coconut', 'coconut fruit', 'thengai', 'dry coconut', 'copra'],
    category: 'Agricultural Products',
  },
  {
    canonical: 'organic manure',
    synonyms: ['manure', 'compost', 'fertilizer', 'organic fertilizer', 'vermicompost', 'cow dung manure', 'bio manure'],
    category: 'Agricultural Products',
  },
  // Grains
  {
    canonical: 'wheat',
    synonyms: ['wheat', 'wheat grain', 'wheat flour', 'atta', 'maida', 'wheat berries', 'durum wheat'],
    category: 'Grains',
  },
  {
    canonical: 'maize',
    synonyms: ['maize', 'corn', 'corn kernels', 'sweet corn', 'maize grain', 'corn cob', 'field corn'],
    category: 'Grains',
  },
  {
    canonical: 'millets',
    synonyms: ['millet', 'ragi', 'finger millet', 'pearl millet', 'bajra', 'jowar', 'sorghum', 'small millets', 'kodo millet'],
    category: 'Grains',
  },
  // Spices
  {
    canonical: 'chili',
    synonyms: ['chili', 'chilli', 'red chili', 'chili powder', 'green chili', 'dry chili', 'mirchi', 'bird eye chili'],
    category: 'Spices',
  },
  {
    canonical: 'coriander',
    synonyms: ['coriander', 'coriander seeds', 'dhania', 'coriander powder', 'cilantro seeds'],
    category: 'Spices',
  },
  {
    canonical: 'black pepper',
    synonyms: ['pepper', 'black pepper', 'peppercorn', 'pepper seeds', 'kali mirch', 'white pepper'],
    category: 'Spices',
  },
  // Paper Products
  {
    canonical: 'craft paper',
    synonyms: ['kraft paper', 'craft paper', 'brown paper', 'wrapping paper', 'paper roll', 'kraft roll'],
    category: 'Paper Products',
  },
  {
    canonical: 'paper bag',
    synonyms: ['paper bag', 'paper pouch', 'paper sack', 'brown paper bag', 'kraft bag', 'shopping bag', 'paper carry bag'],
    category: 'Paper Products',
  },
  {
    canonical: 'paper board',
    synonyms: ['paper board', 'cardboard sheet', 'paper sheet', 'mounting board', 'grey board', 'chip board'],
    category: 'Paper Products',
  },
];

// Category relationship map — categories that are related to each other
export const CATEGORY_RELATIONS: Record<ProductCategory, ProductCategory[]> = {
  'Cotton & Textile Materials': ['Cotton & Textile Materials', "Boys' T-Shirts & Garments"],
  "Boys' T-Shirts & Garments": ["Boys' T-Shirts & Garments", 'Cotton & Textile Materials'],
  'Wholesale Components & Packaging': ['Wholesale Components & Packaging', 'Paper Products'],
  'Rice & Paddy': ['Rice & Paddy', 'Agricultural Products', 'Grains'],
  'Agricultural Products': ['Agricultural Products', 'Rice & Paddy', 'Spices', 'Grains'],
  'Grains': ['Grains', 'Rice & Paddy', 'Agricultural Products'],
  'Spices': ['Spices', 'Agricultural Products'],
  'Paper Products': ['Paper Products', 'Wholesale Components & Packaging'],
};

// Common stop words to remove during text normalization
export const STOP_WORDS = new Set([
  'the', 'a', 'an', 'for', 'of', 'in', 'on', 'at', 'to', 'is', 'are', 'was', 'were',
  'and', 'or', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'this', 'that', 'these', 'those',
  'it', 'its', 'has', 'have', 'had', 'been', 'being', 'be', 'will', 'would', 'can',
  'could', 'should', 'may', 'might', 'must', 'shall', 'do', 'does', 'did', 'not',
  'no', 'yes', 'but', 'if', 'then', 'else', 'when', 'where', 'why', 'how', 'all',
  'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'any', 'now',
]);

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(text: string): string[] {
  const normalized = normalizeText(text);
  return normalized
    .split(' ')
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

export function findSynonymGroup(text: string): SynonymGroup | null {
  const normalized = normalizeText(text);
  for (const group of SYNONYM_GROUPS) {
    if (normalized.includes(group.canonical)) return group;
    for (const synonym of group.synonyms) {
      if (normalized.includes(synonym)) return group;
    }
  }
  return null;
}

export function getSynonymsForText(text: string): string[] {
  const group = findSynonymGroup(text);
  if (!group) return [];
  return [group.canonical, ...group.synonyms];
}

export function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}
