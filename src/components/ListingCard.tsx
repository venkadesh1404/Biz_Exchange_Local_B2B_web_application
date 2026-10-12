import { Link } from 'react-router-dom';
import { MapPin, Building2, Package } from 'lucide-react';
import type { Listing } from '@/types';
import { Card, ListingTypeBadge, Badge } from '@/components/ui';
import { formatINR, formatRelativeTime, truncate } from '@/lib/utils';

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link to={`/listings/${listing.listingId}`}>
      <Card className="p-5 h-full flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <ListingTypeBadge type={listing.listingType} />
            <Badge variant="slate">{listing.category}</Badge>
          </div>
          <span className="text-xs text-slate-400 shrink-0">{formatRelativeTime(listing.createdAt)}</span>
        </div>

        <h3 className="text-base font-semibold text-slate-900 leading-snug mb-1.5">
          {listing.productName}
        </h3>
        <p className="text-sm text-slate-500 mb-4 flex-1">{truncate(listing.description, 90)}</p>

        <div className="space-y-2 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Quantity</span>
            <span className="font-medium text-slate-900">{listing.quantity.toLocaleString('en-IN')} {listing.unit}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Price</span>
            <span className="font-semibold text-emerald-700">{formatINR(listing.price)}/{listing.unit}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> Business</span>
            <span className="font-medium text-slate-700 text-right truncate max-w-[150px]">{listing.businessName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Location</span>
            <span className="font-medium text-slate-700">{listing.location}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function ListingCardSkeleton() {
  return (
    <Card className="p-5 h-full animate-pulse">
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-16 rounded-full bg-slate-200" />
        <div className="h-5 w-24 rounded-full bg-slate-200" />
      </div>
      <div className="h-5 w-3/4 rounded bg-slate-200 mb-2" />
      <div className="h-4 w-full rounded bg-slate-100 mb-4" />
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-full rounded bg-slate-100" />
      </div>
    </Card>
  );
}
