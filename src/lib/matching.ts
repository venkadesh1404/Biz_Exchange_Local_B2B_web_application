import type { Listing, MatchResult, MatchFilters } from '@/types';
import {
  normalizeText, tokenize, findSynonymGroup, jaccardSimilarity,
  CATEGORY_RELATIONS, SYNONYM_GROUPS,
} from '@/lib/synonyms';

// ============================================================
// AI SEMANTIC MATCHING ENGINE
// Weighted scoring model:
//   Product name + synonym similarity: 40%
//   Description similarity:             20%
//   Category similarity:                15%
//   Location suitability:               10%
//   Quantity suitability:               10%
//   Price suitability:                   5%
// Final score normalized to 0–100.
// ============================================================

const WEIGHTS = {
  name: 0.40,
  description: 0.20,
  category: 0.15,
  location: 0.10,
  quantity: 0.10,
  price: 0.05,
};

export function matchListings(
  source: Listing,
  allListings: Listing[],
  filters?: MatchFilters
): MatchResult[] {
  const targetType = source.listingType === 'NEED' ? 'HAVE' : 'NEED';

  const candidates = allListings.filter((l) => {
    if (!l.isActive) return false;
    if (l.listingType !== targetType) return false;
    if (l.businessId === source.businessId) return false;
    if (filters?.location && filters.location !== 'ALL' && l.location !== filters.location) return false;
    if (filters?.minQuantity && l.quantity < filters.minQuantity) return false;
    if (filters?.maxPrice && l.price > filters.maxPrice) return false;
    return true;
  });

  const results: MatchResult[] = candidates.map((candidate) => {
    const breakdown = scorePair(source, candidate);
    const rawScore =
      breakdown.nameScore * WEIGHTS.name +
      breakdown.descriptionScore * WEIGHTS.description +
      breakdown.categoryScore * WEIGHTS.category +
      breakdown.locationScore * WEIGHTS.location +
      breakdown.quantityScore * WEIGHTS.quantity +
      breakdown.priceScore * WEIGHTS.price;
    const score = Math.round(rawScore * 100);
    const matchLabel = getMatchLabel(score);
    const explanation = buildExplanation(source, candidate, breakdown);
    return { listing: candidate, score, matchLabel, explanation, breakdown };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .filter((r, idx, arr) => arr.findIndex((x) => x.listing.listingId === r.listing.listingId) === idx);
}

interface ScoreBreakdown {
  nameScore: number;
  descriptionScore: number;
  categoryScore: number;
  locationScore: number;
  quantityScore: number;
  priceScore: number;
}

function scorePair(source: Listing, candidate: Listing): ScoreBreakdown {
  return {
    nameScore: scoreNameSimilarity(source, candidate),
    descriptionScore: scoreDescriptionSimilarity(source, candidate),
    categoryScore: scoreCategorySimilarity(source.category, candidate.category),
    locationScore: scoreLocationSuitability(source.location, candidate.location),
    quantityScore: scoreQuantitySuitability(source.quantity, candidate.quantity),
    priceScore: scorePriceSuitability(source.price, candidate.price, source.listingType),
  };
}

function scoreNameSimilarity(source: Listing, candidate: Listing): number {
  const sourceTokens = new Set(tokenize(source.productName));
  const candidateTokens = new Set(tokenize(candidate.productName));
  const tokenScore = jaccardSimilarity(sourceTokens, candidateTokens);

  const sourceGroup = findSynonymGroup(source.productName);
  const candidateGroup = findSynonymGroup(candidate.productName);
  let synonymScore = 0;
  if (sourceGroup && candidateGroup) {
    if (sourceGroup.canonical === candidateGroup.canonical) {
      synonymScore = 1.0;
    } else if (sourceGroup.category === candidateGroup.category) {
      synonymScore = 0.5;
    }
  } else if (sourceGroup) {
    const candidateNormalized = normalizeText(candidate.productName);
    if (sourceGroup.synonyms.some((s) => candidateNormalized.includes(s))) {
      synonymScore = 0.8;
    }
  } else if (candidateGroup) {
    const sourceNormalized = normalizeText(source.productName);
    if (candidateGroup.synonyms.some((s) => sourceNormalized.includes(s))) {
      synonymScore = 0.8;
    }
  }

  const partialMatch = checkPartialWordMatch(source.productName, candidate.productName);

  return Math.max(tokenScore, synonymScore, partialMatch);
}

function checkPartialWordMatch(textA: string, textB: string): number {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);
  if (tokensA.length === 0 || tokensB.length === 0) return 0;
  let matches = 0;
  for (const ta of tokensA) {
    for (const tb of tokensB) {
      if (ta === tb || (ta.length >= 4 && tb.length >= 4 && (ta.includes(tb) || tb.includes(ta)))) {
        matches++;
        break;
      }
    }
  }
  return matches / Math.max(tokensA.length, tokensB.length);
}

function scoreDescriptionSimilarity(source: Listing, candidate: Listing): number {
  const sourceTokens = new Set(tokenize(source.description));
  const candidateTokens = new Set(tokenize(candidate.description));
  return jaccardSimilarity(sourceTokens, candidateTokens);
}

function scoreCategorySimilarity(catA: Listing['category'], catB: Listing['category']): number {
  if (catA === catB) return 1.0;
  const related = CATEGORY_RELATIONS[catA] ?? [];
  if (related.includes(catB)) return 0.5;
  return 0;
}

function scoreLocationSuitability(locA: string, locB: string): number {
  if (locA === locB) return 1.0;
  const nearbyMap: Record<string, string[]> = {
    'Coimbatore': ['Pollachi', 'Tiruppur', 'Erode'],
    'Tiruppur': ['Coimbatore', 'Erode', 'Salem'],
    'Erode': ['Coimbatore', 'Tiruppur', 'Salem'],
    'Pollachi': ['Coimbatore'],
    'Salem': ['Erode', 'Tiruppur'],
    'Thanjavur': ['Tirunelveli'],
    'Tirunelveli': ['Madurai', 'Thanjavur'],
    'Madurai': ['Tirunelveli'],
  };
  const nearby = nearbyMap[locA] ?? [];
  if (nearby.includes(locB)) return 0.7;
  return 0.3;
}

function scoreQuantitySuitability(qA: number, qB: number): number {
  if (qA === 0 || qB === 0) return 0;
  const ratio = Math.min(qA, qB) / Math.max(qA, qB);
  if (ratio >= 0.8) return 1.0;
  if (ratio >= 0.5) return 0.7;
  if (ratio >= 0.3) return 0.4;
  return 0.2;
}

function scorePriceSuitability(pA: number, pB: number, sourceType: Listing['listingType']): number {
  if (pA === 0 || pB === 0) return 0.5;
  const ratio = Math.min(pA, pB) / Math.max(pA, pB);
  if (sourceType === 'NEED') {
    // Source is a buyer with a target price; candidate is a seller with an asking price
    if (pB <= pA) return 1.0; // asking price at or below target
    if (ratio >= 0.9) return 0.8;
    if (ratio >= 0.7) return 0.5;
    return 0.2;
  } else {
    // Source is a seller with asking price; candidate is a buyer with target price
    if (pB >= pA) return 1.0; // buyer's target at or above asking
    if (ratio >= 0.9) return 0.8;
    if (ratio >= 0.7) return 0.5;
    return 0.2;
  }
}

function getMatchLabel(score: number): MatchResult['matchLabel'] {
  if (score >= 65) return 'Strong Match';
  if (score >= 40) return 'Good Match';
  return 'Possible Match';
}

function buildExplanation(source: Listing, candidate: Listing, b: ScoreBreakdown): string {
  const parts: string[] = [];

  const sourceGroup = findSynonymGroup(source.productName);
  const candidateGroup = findSynonymGroup(candidate.productName);
  if (sourceGroup && candidateGroup && sourceGroup.canonical === candidateGroup.canonical) {
    parts.push(`both listings relate to ${sourceGroup.canonical}`);
  } else if (b.nameScore > 0.5) {
    parts.push(`the product names are closely related`);
  } else if (b.nameScore > 0.2) {
    parts.push(`the products share common keywords`);
  }

  if (b.categoryScore === 1.0) {
    parts.push(`are in the same category (${source.category})`);
  } else if (b.categoryScore > 0) {
    parts.push(`are in related categories`);
  }

  if (b.locationScore === 1.0) {
    parts.push(`are in the same location (${source.location})`);
  } else if (b.locationScore >= 0.7) {
    parts.push(`are in nearby locations (${source.location} and ${candidate.location})`);
  }

  if (b.quantityScore >= 0.8) {
    parts.push(`have compatible quantities`);
  } else if (b.quantityScore >= 0.5) {
    parts.push(`have reasonably matching quantities`);
  }

  if (b.priceScore >= 0.8) {
    parts.push(`have favorable pricing`);
  } else if (b.priceScore >= 0.5) {
    parts.push(`have acceptable pricing`);
  }

  if (parts.length === 0) {
    return `This listing may be relevant based on general similarity.`;
  }

  const lead = source.listingType === 'NEED'
    ? `Matched because this HAVE listing`
    : `Matched because this NEED listing`;
  return `${lead} ${joinParts(parts)}.`;
}

function joinParts(parts: string[]): string {
  if (parts.length <= 1) return parts[0] ?? '';
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}

// Export synonym info for potential UI display
export { SYNONYM_GROUPS };
