import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, Store } from 'lucide-react';
import { listingService, filterListings } from '@/services';
import { CATEGORIES, LOCATIONS, type ListingType, type ProductCategory } from '@/types';
import { Button, Input, Select, Card, EmptyState, LoadingSpinner, Badge } from '@/components/ui';
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard';
import { cn } from '@/lib/utils';

export function MarketplacePage() {
  const { data: listings, isLoading, isError, refetch } = useQuery({
    queryKey: ['all-listings'],
    queryFn: () => listingService.getAll(),
  });

  const [search, setSearch] = useState('');
  const [listingType, setListingType] = useState<ListingType | 'ALL'>('ALL');
  const [category, setCategory] = useState<ProductCategory | 'ALL'>('ALL');
  const [city, setCity] = useState<string>('ALL');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'relevance'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    if (!listings) return [];
    return filterListings(listings, {
      search,
      listingType,
      category,
      city,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minQuantity: minQuantity ? Number(minQuantity) : undefined,
      sortBy,
    });
  }, [listings, search, listingType, category, city, minPrice, maxPrice, minQuantity, sortBy]);

  const needCount = filtered.filter((l) => l.listingType === 'NEED').length;
  const haveCount = filtered.filter((l) => l.listingType === 'HAVE').length;

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marketplace</h1>
          <p className="text-sm text-slate-500 mt-1">Browse NEED and HAVE listings from businesses across Tamil Nadu</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product, category, business, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
      </div>

      {/* NEED/HAVE toggle */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setListingType('ALL')}
          className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            listingType === 'ALL' ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}
        >
          All Listings
        </button>
        <button
          onClick={() => setListingType('NEED')}
          className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            listingType === 'NEED' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}
        >
          I NEED ({needCount})
        </button>
        <button
          onClick={() => setListingType('HAVE')}
          className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            listingType === 'HAVE' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}
        >
          I HAVE ({haveCount})
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value as ProductCategory | 'ALL')}>
              <option value="ALL">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select label="City" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="ALL">All Cities</option>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </Select>
            <Input label="Min Price" type="number" min="0" placeholder="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            <Input label="Max Price" type="number" min="0" placeholder="No limit" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            <Input label="Min Quantity" type="number" min="0" placeholder="0" value={minQuantity} onChange={(e) => setMinQuantity(e.target.value)} />
            <Select label="Sort By" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'newest' | 'relevance')}>
              <option value="newest">Newest First</option>
              <option value="relevance">Relevance</option>
            </Select>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => {
              setCategory('ALL'); setCity('ALL'); setMinPrice(''); setMaxPrice(''); setMinQuantity(''); setSortBy('newest');
            }}>Clear Filters</Button>
          </div>
        </Card>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
        </p>
        <Badge variant="slate">{listingType === 'ALL' ? 'All Types' : listingType}</Badge>
      </div>

      {/* Listings grid */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)}
        </div>
      )}
      {isError && <EmptyState icon={<Store className="h-12 w-12" />} title="Failed to load listings" description="There was an error loading the marketplace. Please try again." action={<Button variant="outline" size="sm" onClick={() => refetch()}>Try again</Button>} />}
      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState icon={<Store className="h-12 w-12" />} title="No listings found" description="Try adjusting your search or filters to find what you're looking for." />
      )}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((listing) => <ListingCard key={listing.listingId} listing={listing} />)}
        </div>
      )}
    </div>
  );
}
