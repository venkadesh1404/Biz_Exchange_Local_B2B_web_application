import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Package, ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock,
  TrendingUp, Sparkles, Inbox, Plus, ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dashboardService } from '@/services';
import { StatCard, Card, LoadingSpinner, EmptyState, PageHeader, Badge, ListingTypeBadge } from '@/components/ui';
import { formatRelativeTime, formatINR, cn } from '@/lib/utils';

export function DashboardPage() {
  const { business } = useAuth();
  const { data: summary, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard', business?.businessId],
    queryFn: () => dashboardService.getSummary(business!.businessId),
    enabled: !!business,
  });

  if (isLoading) return <LoadingSpinner label="Loading dashboard..." />;
  if (isError || !summary) return <EmptyState title="Failed to load dashboard" description="Please try again." action={<button onClick={() => refetch()} className="text-emerald-600">Retry</button>} />;

  const maxCategoryCount = Math.max(...summary.categoryBreakdown.map((c) => c.count), 1);
  const totalRequests = summary.requestStatusBreakdown.pending + summary.requestStatusBreakdown.accepted + summary.requestStatusBreakdown.rejected;
  const maxNeedHave = Math.max(summary.needVsHave.need, summary.needVsHave.have, 1);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${business?.businessName}`}
        action={<Link to="/listings/new"><Plus className="h-4 w-4" /> New Listing</Link>}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard label="Active Listings" value={summary.totalActiveListings} icon={<Package className="h-5 w-5" />} accent="emerald" />
        <StatCard label="NEED Listings" value={summary.needListings} icon={<ArrowDownLeft className="h-5 w-5" />} accent="blue" />
        <StatCard label="HAVE Listings" value={summary.haveListings} icon={<TrendingUp className="h-5 w-5" />} accent="teal" />
        <StatCard label="Incoming Requests" value={summary.incomingRequests} icon={<Inbox className="h-5 w-5" />} accent="amber" />
        <StatCard label="Outgoing Requests" value={summary.outgoingRequests} icon={<ArrowUpRight className="h-5 w-5" />} accent="slate" />
        <StatCard label="Accepted" value={summary.acceptedRequests} icon={<CheckCircle2 className="h-5 w-5" />} accent="emerald" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Category breakdown */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Listings by Category</h3>
          <div className="space-y-3">
            {summary.categoryBreakdown.slice(0, 6).map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 truncate pr-2">{item.category}</span>
                  <span className="font-medium text-slate-900">{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${(item.count / maxCategoryCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* NEED vs HAVE */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">NEED vs HAVE</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600">NEED</span>
                <span className="font-medium text-blue-700">{summary.needVsHave.need}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${(summary.needVsHave.need / maxNeedHave) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600">HAVE</span>
                <span className="font-medium text-emerald-700">{summary.needVsHave.have}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(summary.needVsHave.have / maxNeedHave) * 100}%` }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Request status breakdown */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Request Status</h3>
          {totalRequests === 0 ? (
            <p className="text-sm text-slate-400">No requests yet</p>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Pending', count: summary.requestStatusBreakdown.pending, color: 'bg-amber-500', textColor: 'text-amber-700' },
                { label: 'Accepted', count: summary.requestStatusBreakdown.accepted, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
                { label: 'Rejected', count: summary.requestStatusBreakdown.rejected, color: 'bg-red-500', textColor: 'text-red-700' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600">{item.label}</span>
                    <span className={cn('font-medium', item.textColor)}>{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all', item.color)} style={{ width: `${totalRequests > 0 ? (item.count / totalRequests) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Bottom row: recent listings + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent listings */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Recent Listings</h3>
            <Link to="/marketplace" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {summary.recentListings.length === 0 ? (
            <EmptyState title="No listings yet" description="Create your first listing to get started." action={<Link to="/listings/new" className="text-sm text-emerald-600 font-medium">Create listing</Link>} />
          ) : (
            <div className="space-y-3">
              {summary.recentListings.map((l) => (
                <Link key={l.listingId} to={`/listings/${l.listingId}`} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <ListingTypeBadge type={l.listingType} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{l.productName}</p>
                      <p className="text-xs text-slate-400">{formatRelativeTime(l.createdAt)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-emerald-700 shrink-0">{formatINR(l.price)}/{l.unit}</span>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Recent activity */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </div>
          {summary.recentActivity.length === 0 ? (
            <EmptyState title="No activity yet" description="Your recent actions will appear here." />
          ) : (
            <div className="space-y-3">
              {summary.recentActivity.map((act) => (
                <div key={act.id} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                  <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center shrink-0',
                    act.type === 'listing_created' ? 'bg-emerald-50 text-emerald-600' :
                    act.type === 'request_sent' ? 'bg-blue-50 text-blue-600' :
                    act.type === 'request_received' ? 'bg-amber-50 text-amber-600' :
                    act.type === 'request_accepted' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-red-50 text-red-600')}>
                    {act.type === 'listing_created' ? <Package className="h-3.5 w-3.5" /> :
                     act.type === 'request_sent' ? <ArrowUpRight className="h-3.5 w-3.5" /> :
                     act.type === 'request_received' ? <Inbox className="h-3.5 w-3.5" /> :
                     act.type === 'request_accepted' ? <CheckCircle2 className="h-3.5 w-3.5" /> :
                     <Clock className="h-3.5 w-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700">{act.message}</p>
                    <p className="text-xs text-slate-400">{formatRelativeTime(act.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
