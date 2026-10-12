import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, MapPin, Building2, Send,
  SlidersHorizontal, Info,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { listingService, matchService } from '@/services';
import {
  Button, Card, Select, Input, Badge, ListingTypeBadge, MatchLabelBadge,
  LoadingSpinner, EmptyState, PageHeader,
} from '@/components/ui';
import { formatINR, cn } from '@/lib/utils';
import type { MatchFilters } from '@/types';

export function MatchCenterPage() {
  const { business } = useAuth();
  const [selectedListingId, setSelectedListingId] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({
    location: 'ALL',
    minQuantity: '',
    maxPrice: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: myListings, isLoading: listingsLoading } = useQuery({
    queryKey: ['my-listings', business?.businessId],
    queryFn: () => listingService.getByBusiness(business!.businessId),
    enabled: !!business,
  });

  const matchFilters: MatchFilters | undefined = hasSearched ? {
    location: filters.location || 'ALL',
    minQuantity: filters.minQuantity ? Number(filters.minQuantity) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
  } : undefined;

  const { data: matches, isLoading: matchesLoading, isError, refetch } = useQuery({
    queryKey: ['matches', selectedListingId, matchFilters],
    queryFn: () => matchService.findMatches(selectedListingId, matchFilters),
    enabled: !!selectedListingId && hasSearched,
  });

  const handleRunMatching = () => {
    if (!selectedListingId) return;
    setHasSearched(true);
  };

  const selectedListing = myListings?.find((l) => l.listingId === selectedListingId);

  return (
    <div>
      <PageHeader
        title="AI Match Center"
        subtitle="Select one of your listings and let our semantic matching engine find the right business partner."
      />

      {/* Listing selector */}
      <Card className="p-6 mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Select Your Listing to Find Matches
        </label>
        {listingsLoading ? (
          <LoadingSpinner label="Loading your listings..." />
        ) : !myListings || myListings.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="h-10 w-10" />}
            title="No listings yet"
            description="Create a listing first to use the AI Match Center."
            action={<Link to="/listings/new"><Button size="sm">Create Listing</Button></Link>}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {myListings.map((listing) => (
                <button
                  key={listing.listingId}
                  onClick={() => { setSelectedListingId(listing.listingId); setHasSearched(false); }}
                  className={cn(
                    'text-left p-4 rounded-xl border-2 transition-all',
                    selectedListingId === listing.listingId
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ListingTypeBadge type={listing.listingType} />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 truncate">{listing.productName}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {listing.quantity.toLocaleString('en-IN')} {listing.unit} &middot; {formatINR(listing.price)}/{listing.unit}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{listing.location}</p>
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-800"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filter results
              </button>
              <Button onClick={handleRunMatching} disabled={!selectedListingId} loading={matchesLoading}>
                <Sparkles className="h-4 w-4" /> Run AI Matching
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-lg bg-slate-50 mb-3">
                <Select label="Location" value={filters.location} onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}>
                  <option value="ALL">All Locations</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Tiruppur">Tiruppur</option>
                  <option value="Erode">Erode</option>
                  <option value="Pollachi">Pollachi</option>
                  <option value="Salem">Salem</option>
                  <option value="Tirunelveli">Tirunelveli</option>
                  <option value="Thanjavur">Thanjavur</option>
                  <option value="Madurai">Madurai</option>
                </Select>
                <Input label="Min Quantity" type="number" min="0" placeholder="0" value={filters.minQuantity} onChange={(e) => setFilters((f) => ({ ...f, minQuantity: e.target.value }))} />
                <Input label="Max Price" type="number" min="0" placeholder="No limit" value={filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))} />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Match results */}
      {hasSearched && selectedListing && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Match Results</h2>
              <p className="text-xs text-slate-500">
                Matching your {selectedListing.listingType} listing "{selectedListing.productName}" against {selectedListing.listingType === 'NEED' ? 'HAVE' : 'NEED'} listings
              </p>
            </div>
          </div>

          {matchesLoading && <LoadingSpinner label="Running AI semantic matching..." />}

          {isError && (
            <EmptyState title="Matching failed" description="An error occurred while finding matches. Please try again." action={<Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>} />
          )}

          {!matchesLoading && !isError && matches && matches.length === 0 && (
            <Card className="p-8">
              <EmptyState
                icon={<Info className="h-10 w-10" />}
                title="No relevant matches found"
                description="Try adjusting your filters or check back later as new listings are added."
              />
            </Card>
          )}

          {!matchesLoading && !isError && matches && matches.length > 0 && (
            <div className="space-y-4">
              {matches.map((match) => (
                <Card key={match.listing.listingId} className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <ListingTypeBadge type={match.listing.listingType} />
                        <MatchLabelBadge label={match.matchLabel} />
                        <Badge variant="teal">{match.score}/100 score</Badge>
                      </div>
                      <h3 className="text-base font-semibold text-slate-900">{match.listing.productName}</h3>
                      <p className="text-sm text-slate-500 mt-1">{match.listing.description}</p>

                      {/* Explanation */}
                      <div className="mt-3 rounded-lg bg-emerald-50/60 border border-emerald-100 p-3">
                        <p className="text-xs text-emerald-800 leading-relaxed flex items-start gap-2">
                          <Sparkles className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600" />
                          {match.explanation}
                        </p>
                      </div>

                      {/* Score breakdown */}
                      <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {[
                          { label: 'Name', value: match.breakdown.nameScore, weight: '40%' },
                          { label: 'Desc', value: match.breakdown.descriptionScore, weight: '20%' },
                          { label: 'Category', value: match.breakdown.categoryScore, weight: '15%' },
                          { label: 'Location', value: match.breakdown.locationScore, weight: '10%' },
                          { label: 'Qty', value: match.breakdown.quantityScore, weight: '10%' },
                          { label: 'Price', value: match.breakdown.priceScore, weight: '5%' },
                        ].map((s) => (
                          <div key={s.label} className="text-center">
                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-1">
                              <div
                                className={cn('h-full rounded-full',
                                  s.value >= 0.7 ? 'bg-emerald-500' : s.value >= 0.4 ? 'bg-amber-400' : 'bg-slate-300')}
                                style={{ width: `${s.value * 100}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-500">{s.label}</p>
                            <p className="text-[10px] text-slate-400">{s.weight}</p>
                          </div>
                        ))}
                      </div>

                      {/* Details */}
                      <div className="mt-3 flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1 text-slate-600"><Building2 className="h-3.5 w-3.5" /> {match.listing.businessName}</span>
                        <span className="flex items-center gap-1 text-slate-600"><MapPin className="h-3.5 w-3.5" /> {match.listing.location}</span>
                        <span className="text-slate-600">{match.listing.quantity.toLocaleString('en-IN')} {match.listing.unit}</span>
                        <span className="font-semibold text-emerald-700">{formatINR(match.listing.price)}/{match.listing.unit}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Link to={`/listings/${match.listing.listingId}`}>
                        <Button variant="outline" size="sm" className="w-full">View Details <ArrowRight className="h-3.5 w-3.5" /></Button>
                      </Link>
                      <Link to={`/listings/${match.listing.listingId}`}>
                        <Button size="sm" className="w-full"><Send className="h-3.5 w-3.5" /> Send Request</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {!hasSearched && (
        <Card className="p-8">
          <EmptyState
            icon={<Sparkles className="h-10 w-10" />}
            title="Ready to find matches"
            description="Select one of your listings above and click 'Run AI Matching' to discover relevant business partners."
          />
        </Card>
      )}
    </div>
  );
}
