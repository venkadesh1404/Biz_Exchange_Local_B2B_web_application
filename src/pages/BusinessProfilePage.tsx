import { useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building2, MapPin, Phone, Mail, Calendar, Edit, Check, AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { businessService, listingService } from '@/services';
import {
  Button, Card, Input, Select, Textarea, Modal, Badge,
  LoadingSpinner, EmptyState, PageHeader, ListingTypeBadge,
} from '@/components/ui';
import { formatDate, formatINR } from '@/lib/utils';
import { BUSINESS_TYPES, LOCATIONS } from '@/types';
import { Link } from 'react-router-dom';
import { ListingCard } from '@/components/ListingCard';

export function BusinessProfilePage() {
  const { business, updateBusiness } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    businessName: business?.businessName ?? '',
    businessType: business?.businessType ?? '',
    location: business?.location ?? '',
    contactNumber: business?.contactNumber ?? '',
    description: business?.description ?? '',
  });
  const [error, setError] = useState('');

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['business-profile', business?.businessId],
    queryFn: () => businessService.getById(business!.businessId),
    enabled: !!business,
  });

  const { data: myListings, isLoading: listingsLoading } = useQuery({
    queryKey: ['profile-listings', business?.businessId],
    queryFn: () => listingService.getByBusiness(business!.businessId),
    enabled: !!business,
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      updateBusiness({
        businessName: form.businessName,
        businessType: form.businessType as import('@/types').BusinessType,
        location: form.location,
        contactNumber: form.contactNumber,
        description: form.description,
      });
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-profile'] });
      queryClient.invalidateQueries({ queryKey: ['all-listings'] });
      setEditing(false);
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to update profile'),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.businessName.trim()) { setError('Business name is required'); return; }
    if (form.contactNumber.length < 10) { setError('Contact number must be at least 10 digits'); return; }
    updateMutation.mutate();
  };

  if (profileLoading) return <LoadingSpinner label="Loading profile..." />;

  const activeListings = myListings?.filter((l) => l.isActive) ?? [];
  const acceptedCount = 0; // Would be calculated from requests in a full implementation

  return (
    <div>
      <PageHeader
        title="Business Profile"
        subtitle="Your business information and active listings"
        action={<Button variant="outline" onClick={() => { setForm({
          businessName: profile?.businessName ?? business?.businessName ?? '',
          businessType: profile?.businessType ?? business?.businessType ?? '',
          location: profile?.location ?? business?.location ?? '',
          contactNumber: profile?.contactNumber ?? business?.contactNumber ?? '',
          description: profile?.description ?? business?.description ?? '',
        }); setEditing(true); }}>
          <Edit className="h-4 w-4" /> Edit Profile
        </Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="text-center mb-5">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-md">
                {profile?.businessName?.charAt(0) ?? 'B'}
              </div>
              <h2 className="text-lg font-bold text-slate-900">{profile?.businessName ?? business?.businessName}</h2>
              <Badge variant="emerald" className="mt-1">{profile?.businessType ?? business?.businessType}</Badge>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400" /> {profile?.location ?? business?.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="h-4 w-4 text-slate-400" /> {profile?.contactNumber ?? business?.contactNumber}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4 text-slate-400" /> Member since {formatDate(profile?.createdAt ?? business?.createdAt ?? new Date().toISOString())}
              </div>
            </div>

            {profile?.description && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-1">About</p>
                <p className="text-sm text-slate-600 leading-relaxed">{profile.description}</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-xl font-bold text-slate-900">{activeListings.length}</p>
                <p className="text-xs text-slate-500">Active Listings</p>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-700">{acceptedCount}</p>
                <p className="text-xs text-slate-500">Accepted</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Active listings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Active Listings</h3>
            <Link to="/listings/new"><Button size="sm">New Listing</Button></Link>
          </div>

          {listingsLoading ? (
            <LoadingSpinner label="Loading listings..." />
          ) : activeListings.length === 0 ? (
            <Card className="p-8">
              <EmptyState
                icon={<Building2 className="h-10 w-10" />}
                title="No active listings"
                description="Create your first listing to start receiving exchange requests."
                action={<Link to="/listings/new"><Button size="sm">Create Listing</Button></Link>}
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeListings.map((listing) => (
                <ListingCard key={listing.listingId} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Business Profile">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <Input label="Business Name" value={form.businessName} onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))} required />
          <Select label="Business Type" value={form.businessType} onChange={(e) => setForm((f) => ({ ...f, businessType: e.target.value }))} required>
            {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Select label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} required>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </Select>
          <Input label="Contact Number" value={form.contactNumber} onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value }))} required />
          <Textarea label="About Your Business" rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Tell other businesses about what you do..." />
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            <Button type="submit" loading={updateMutation.isPending}><Check className="h-4 w-4" /> Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
