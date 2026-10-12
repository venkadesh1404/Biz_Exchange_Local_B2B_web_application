import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, MapPin, Building2, Package, Phone, Trash2, Edit,
  Send, AlertCircle, Info,
} from 'lucide-react';
import { listingService, requestService, businessService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import {
  Button, Card, Modal, Input, Textarea, Badge, ListingTypeBadge,
  LoadingSpinner, EmptyState, ErrorState,
} from '@/components/ui';
import { formatINR, formatDate } from '@/lib/utils';
import type { CreateRequestInput } from '@/types';

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { business } = useAuth();
  const queryClient = useQueryClient();

  const { data: listing, isLoading, isError, refetch } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingService.getById(id!),
    enabled: !!id,
  });

  const { data: listingBusiness } = useQuery({
    queryKey: ['business', listing?.businessId],
    queryFn: () => businessService.getById(listing!.businessId),
    enabled: !!listing?.businessId,
  });

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ quantity: '', price: '', message: '' });
  const [requestError, setRequestError] = useState('');

  const createRequestMutation = useMutation({
    mutationFn: (input: CreateRequestInput) => requestService.create(input, business!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      setShowRequestModal(false);
      setRequestForm({ quantity: '', price: '', message: '' });
      navigate('/requests/sent');
    },
    onError: (err) => setRequestError(err instanceof Error ? err.message : 'Failed to send request'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => listingService.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-listings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/dashboard');
    },
  });

  if (isLoading) return <LoadingSpinner label="Loading listing..." />;
  if (isError || !listing) return <ErrorState message="This listing could not be found." onRetry={() => refetch()} />;

  const isOwner = business?.businessId === listing.businessId;
  const canRequest = business && !isOwner;

  const handleSendRequest = () => {
    setRequestError('');
    const qty = Number(requestForm.quantity);
    const price = Number(requestForm.price);
    if (qty <= 0) { setRequestError('Requested quantity must be greater than zero'); return; }
    if (price < 0) { setRequestError('Offer price cannot be negative'); return; }
    createRequestMutation.mutate({
      listingId: listing.listingId,
      requestedQuantity: qty,
      offerPrice: price,
      message: requestForm.message,
    });
  };

  return (
    <div>
      <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main listing info */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <ListingTypeBadge type={listing.listingType} />
                <Badge variant="slate">{listing.category}</Badge>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/listings/${listing.listingId}/edit`)}>
                    <Edit className="h-4 w-4" /> Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => {
                    if (confirm('Are you sure you want to delete this listing?')) deleteMutation.mutate();
                  }} loading={deleteMutation.isPending}>
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-3">{listing.productName}</h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">{listing.description}</p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500 mb-1">Quantity</p>
                <p className="text-lg font-semibold text-slate-900">{listing.quantity.toLocaleString('en-IN')} {listing.unit}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">{listing.listingType === 'NEED' ? 'Target Price' : 'Offered Price'}</p>
                <p className="text-lg font-semibold text-emerald-700">{formatINR(listing.price)}/{listing.unit}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Location</p>
                <p className="text-sm font-medium text-slate-700 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {listing.location}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Posted On</p>
                <p className="text-sm font-medium text-slate-700">{formatDate(listing.createdAt)}</p>
              </div>
            </div>
          </Card>

          {/* Business info */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" /> Business Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Business Name</p>
                <p className="text-sm font-medium text-slate-900">{listing.businessName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Business Type</p>
                <p className="text-sm font-medium text-slate-700">{listingBusiness?.businessType ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Location</p>
                <p className="text-sm font-medium text-slate-700">{listingBusiness?.location ?? listing.businessLocation}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Contact Number</p>
                <p className="text-sm font-medium text-slate-700 flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {listingBusiness?.contactNumber ?? 'N/A'}</p>
              </div>
            </div>
            {listingBusiness?.description && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-1">About</p>
                <p className="text-sm text-slate-600 leading-relaxed">{listingBusiness.description}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Action panel */}
        <div className="space-y-4">
          <Card className="p-6 sticky top-20">
            {isOwner ? (
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Info className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-700">This is your listing</p>
                <p className="text-xs text-slate-500 mt-1">You can edit or delete it using the buttons above.</p>
                <Link to="/match-center">
                  <Button variant="outline" className="w-full mt-4">
                    <Package className="h-4 w-4" /> Find Matches
                  </Button>
                </Link>
              </div>
            ) : canRequest ? (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">Interested in this listing?</h3>
                <p className="text-xs text-slate-500 mb-4">Send an exchange request with your proposed quantity and price.</p>
                <Button className="w-full" size="lg" onClick={() => setShowRequestModal(true)}>
                  <Send className="h-4 w-4" /> Send Exchange Request
                </Button>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Listing Type</span><span className="font-medium text-slate-700">{listing.listingType}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Quantity</span><span className="font-medium text-slate-700">{listing.quantity.toLocaleString('en-IN')} {listing.unit}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Price</span><span className="font-medium text-emerald-700">{formatINR(listing.price)}/{listing.unit}</span></div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-slate-500">Sign in to send exchange requests.</p>
                <Link to="/login"><Button variant="outline" className="w-full mt-3">Sign In</Button></Link>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Request modal */}
      <Modal open={showRequestModal} onClose={() => setShowRequestModal(false)} title="Send Exchange Request">
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
            <p className="text-sm font-medium text-slate-900">{listing.productName}</p>
            <p className="text-xs text-slate-500 mt-0.5">{listing.businessName} &middot; {listing.location}</p>
            <p className="text-xs text-slate-500 mt-1">Available: {listing.quantity.toLocaleString('en-IN')} {listing.unit} at {formatINR(listing.price)}/{listing.unit}</p>
          </div>

          {requestError && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{requestError}</span>
            </div>
          )}

          <Input
            label={`Requested Quantity (${listing.unit})`}
            type="number"
            min="1"
            placeholder={`e.g. ${Math.min(listing.quantity, 100)}`}
            value={requestForm.quantity}
            onChange={(e) => setRequestForm((f) => ({ ...f, quantity: e.target.value }))}
            required
          />
          <Input
            label={`Offer Price per ${listing.unit} (₹)`}
            type="number"
            min="0"
            placeholder={`e.g. ${listing.price}`}
            value={requestForm.price}
            onChange={(e) => setRequestForm((f) => ({ ...f, price: e.target.value }))}
            required
          />
          <Textarea
            label="Message (optional)"
            rows={3}
            placeholder="Add any details about your request..."
            value={requestForm.message}
            onChange={(e) => setRequestForm((f) => ({ ...f, message: e.target.value }))}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowRequestModal(false)}>Cancel</Button>
            <Button onClick={handleSendRequest} loading={createRequestMutation.isPending}>
              <Send className="h-4 w-4" /> Send Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
