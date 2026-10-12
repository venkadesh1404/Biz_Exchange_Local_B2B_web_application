import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { listingService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Select, Textarea, Card } from '@/components/ui';
import { CATEGORIES, UNITS, LOCATIONS, type ListingType, type ProductCategory } from '@/types';

export function CreateListingPage() {
  const { business } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const { data: existingListing } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingService.getById(id!),
    enabled: !!id,
  });

  const [form, setForm] = useState({
    listingType: (existingListing?.listingType ?? 'HAVE') as ListingType,
    productName: existingListing?.productName ?? '',
    category: (existingListing?.category ?? '') as ProductCategory | '',
    description: existingListing?.description ?? '',
    quantity: existingListing ? String(existingListing.quantity) : '',
    unit: existingListing?.unit ?? 'kg',
    price: existingListing ? String(existingListing.price) : '',
    location: existingListing?.location ?? business?.location ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const createMutation = useMutation({
    mutationFn: () => listingService.create({
      listingType: form.listingType,
      productName: form.productName,
      category: form.category as ProductCategory,
      description: form.description,
      quantity: Number(form.quantity),
      unit: form.unit,
      price: Number(form.price),
      location: form.location,
    }, business!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-listings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      navigate('/dashboard');
    },
    onError: (err) => setSubmitError(err instanceof Error ? err.message : 'Failed to create listing'),
  });

  const updateMutation = useMutation({
    mutationFn: () => listingService.update(id!, {
      listingType: form.listingType,
      productName: form.productName,
      category: form.category as ProductCategory,
      description: form.description,
      quantity: Number(form.quantity),
      unit: form.unit,
      price: Number(form.price),
      location: form.location,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate(`/listings/${id}`);
    },
    onError: (err) => setSubmitError(err instanceof Error ? err.message : 'Failed to update listing'),
  });

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.listingType) e.listingType = 'Please select a listing type';
    if (!form.productName.trim()) e.productName = 'Product name is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.quantity || Number(form.quantity) <= 0) e.quantity = 'Quantity must be greater than zero';
    if (!form.unit) e.unit = 'Unit is required';
    if (form.price === '' || Number(form.price) < 0) e.price = 'Price must be zero or greater';
    if (!form.location) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    if (isEdit) updateMutation.mutate();
    else createMutation.mutate();
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">{isEdit ? 'Edit Listing' : 'Create New Listing'}</h1>
      <p className="text-sm text-slate-500 mb-6">
        {isEdit ? 'Update your listing details.' : 'Post what you NEED or what you HAVE for other businesses to discover.'}
      </p>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {submitError && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Listing type toggle */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Listing Type <span className="text-red-500">*</span></label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => update('listingType', 'NEED')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  form.listingType === 'NEED'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                I NEED &mdash; Looking to buy
              </button>
              <button
                type="button"
                onClick={() => update('listingType', 'HAVE')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  form.listingType === 'HAVE'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                I HAVE &mdash; Available to supply
              </button>
            </div>
            {errors.listingType && <p className="mt-1 text-xs text-red-600">{errors.listingType}</p>}
          </div>

          <Input
            label="Product Name"
            name="productName"
            value={form.productName}
            onChange={(e) => update('productName', e.target.value)}
            placeholder="e.g. Cotton yarn 30s count"
            error={errors.productName}
            required
          />

          <Select
            label="Category"
            name="category"
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            error={errors.category}
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>

          <Textarea
            label="Product Description"
            name="description"
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Describe the product, quality, specifications, and any relevant details..."
            error={errors.description}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => update('quantity', e.target.value)}
              placeholder="e.g. 500"
              error={errors.quantity}
              required
            />
            <Select
              label="Unit"
              name="unit"
              value={form.unit}
              onChange={(e) => update('unit', e.target.value)}
              error={errors.unit}
              required
            >
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={form.listingType === 'NEED' ? 'Target Price per unit (₹)' : 'Offered Price per unit (₹)'}
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              placeholder="e.g. 185"
              error={errors.price}
              required
            />
            <Select
              label="Location"
              name="location"
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              error={errors.location}
              required
            >
              <option value="">Select city</option>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </Select>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" loading={loading}>
              {isEdit ? 'Update Listing' : 'Publish Listing'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
