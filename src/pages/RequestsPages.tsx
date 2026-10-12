import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Send, Inbox, CheckCircle2, XCircle, Clock, Phone, Building2, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { requestService } from '@/services';
import {
  Card, Badge, RequestStatusBadge, Button, LoadingSpinner,
  EmptyState, PageHeader, Modal, Textarea,
} from '@/components/ui';
import { formatINR, formatRelativeTime } from '@/lib/utils';
import { useState } from 'react';
import type { ExchangeRequest, RequestStatus } from '@/types';

export function MyRequestsPage() {
  const { business } = useAuth();
  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests-sent', business?.businessId],
    queryFn: () => requestService.getSent(business!.businessId),
    enabled: !!business,
  });

  return (
    <div>
      <PageHeader title="My Requests" subtitle="Exchange requests you have sent to other businesses" />
      {isLoading && <LoadingSpinner label="Loading requests..." />}
      {!isLoading && (!requests || requests.length === 0) && (
        <Card className="p-8">
          <EmptyState
            icon={<Send className="h-10 w-10" />}
            title="No requests sent yet"
            description="Browse the marketplace and send exchange requests to listings that match your needs."
            action={<Link to="/marketplace"><Button size="sm">Browse Marketplace</Button></Link>}
          />
        </Card>
      )}
      {!isLoading && requests && requests.length > 0 && (
        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.requestId} className="p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <RequestStatusBadge status={req.status} />
                    <span className="text-xs text-slate-400">{formatRelativeTime(req.createdAt)}</span>
                  </div>
                  <Link to={`/listings/${req.listingId}`} className="text-base font-semibold text-slate-900 hover:text-emerald-700">
                    {req.listingProductName}
                  </Link>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {req.listingBusinessName}</span>
                    <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" /> {req.requestedQuantity.toLocaleString('en-IN')} {req.unit}</span>
                    <span className="font-medium text-emerald-700">{formatINR(req.offerPrice)}/{req.unit}</span>
                  </div>
                  {req.message && (
                    <p className="mt-2 text-sm text-slate-500 italic">"{req.message}"</p>
                  )}
                </div>
                <div className="shrink-0">
                  <Link to={`/listings/${req.listingId}`}>
                    <Button variant="outline" size="sm">View Listing</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function IncomingRequestsPage() {
  const { business } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<ExchangeRequest | null>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests-received', business?.businessId],
    queryFn: () => requestService.getReceived(business!.businessId),
    enabled: !!business,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: RequestStatus }) =>
      requestService.updateStatus(requestId, status, business!.businessId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests-received'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setSelectedRequest(null);
    },
  });

  const pendingCount = requests?.filter((r) => r.status === 'PENDING').length ?? 0;
  const acceptedCount = requests?.filter((r) => r.status === 'ACCEPTED').length ?? 0;
  const rejectedCount = requests?.filter((r) => r.status === 'REJECTED').length ?? 0;

  return (
    <div>
      <PageHeader title="Incoming Requests" subtitle="Exchange requests from other businesses for your listings" />

      {/* Summary */}
      {requests && requests.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 text-center">
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
              <Clock className="h-4 w-4" />
            </div>
            <p className="text-xl font-bold text-slate-900">{pendingCount}</p>
            <p className="text-xs text-slate-500">Pending</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <p className="text-xl font-bold text-slate-900">{acceptedCount}</p>
            <p className="text-xs text-slate-500">Accepted</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-2">
              <XCircle className="h-4 w-4" />
            </div>
            <p className="text-xl font-bold text-slate-900">{rejectedCount}</p>
            <p className="text-xs text-slate-500">Rejected</p>
          </Card>
        </div>
      )}

      {isLoading && <LoadingSpinner label="Loading requests..." />}

      {!isLoading && (!requests || requests.length === 0) && (
        <Card className="p-8">
          <EmptyState
            icon={<Inbox className="h-10 w-10" />}
            title="No incoming requests yet"
            description="When other businesses send exchange requests for your listings, they will appear here."
          />
        </Card>
      )}

      {!isLoading && requests && requests.length > 0 && (
        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.requestId} className="p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <RequestStatusBadge status={req.status} />
                    <span className="text-xs text-slate-400">{formatRelativeTime(req.createdAt)}</span>
                  </div>
                  <Link to={`/listings/${req.listingId}`} className="text-base font-semibold text-slate-900 hover:text-emerald-700">
                    {req.listingProductName}
                  </Link>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> From: {req.requesterBusinessName}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {req.requesterContactNumber}</span>
                    <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" /> Qty: {req.requestedQuantity.toLocaleString('en-IN')} {req.unit}</span>
                    <span className="font-medium text-emerald-700">Offer: {formatINR(req.offerPrice)}/{req.unit}</span>
                  </div>
                  {req.message && (
                    <p className="mt-2 text-sm text-slate-500 italic">"{req.message}"</p>
                  )}
                </div>
                <div className="shrink-0 flex gap-2">
                  {req.status === 'PENDING' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatusMutation.mutate({ requestId: req.requestId, status: 'ACCEPTED' })}
                        loading={updateStatusMutation.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4" /> Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => updateStatusMutation.mutate({ requestId: req.requestId, status: 'REJECTED' })}
                        loading={updateStatusMutation.isPending}
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </Button>
                    </>
                  )}
                  <Link to={`/listings/${req.listingId}`}>
                    <Button variant="outline" size="sm">View Listing</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
