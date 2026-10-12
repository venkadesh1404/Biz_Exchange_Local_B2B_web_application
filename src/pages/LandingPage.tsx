import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Search, Package, Handshake, TrendingUp,
  Building2, MapPin, ShoppingBag, Wheat, Shirt, PackageCheck,
  CookingPot, Sprout, Container, FileText,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { listingService } from '@/services';
import type { ProductCategory } from '@/types';

const categoryIcons: Record<string, typeof Package> = {
  'Cotton & Textile Materials': Shirt,
  "Boys' T-Shirts & Garments": ShoppingBag,
  'Wholesale Components & Packaging': PackageCheck,
  'Rice & Paddy': CookingPot,
  'Agricultural Products': Sprout,
  'Grains': Wheat,
  'Spices': Container,
  'Paper Products': FileText,
};

export function LandingPage() {
  const { data: listings } = useQuery({
    queryKey: ['all-listings'],
    queryFn: () => listingService.getAll(),
  });

  const totalListings = listings?.length ?? 0;
  const needCount = listings?.filter((l) => l.listingType === 'NEED').length ?? 0;
  const haveCount = listings?.filter((l) => l.listingType === 'HAVE').length ?? 0;
  const locations = new Set(listings?.map((l) => l.location)).size;
  const categories = new Set(listings?.map((l) => l.category)).size;
  const businesses = new Set(listings?.map((l) => l.businessName)).size;

  const featuredCategories: ProductCategory[] = [
    'Cotton & Textile Materials',
    "Boys' T-Shirts & Garments",
    'Wholesale Components & Packaging',
    'Rice & Paddy',
    'Agricultural Products',
    'Grains',
    'Spices',
    'Paper Products',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              BE
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">BIZ EXCHANGE</p>
              <p className="text-[10px] text-slate-500 leading-tight">AI-Powered B2B Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link to="/register"><Button size="sm">Join as a Business</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-white to-white" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Semantic Matching for Local Businesses
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
              Connecting Local Businesses.<br />
              <span className="text-emerald-700">Unlocking New Opportunities.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl">
              A centralized B2B exchange platform where manufacturers, traders, mills, and suppliers
              discover each other through AI-powered semantic matching. Post what you NEED or what
              you HAVE, and let intelligent matching find the right business partner.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/marketplace">
                <Button size="lg" variant="primary">
                  Explore Marketplace <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline">Join as a Business</Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Active Listings', value: totalListings, icon: <Package className="h-5 w-5" /> },
              { label: 'Businesses', value: businesses, icon: <Building2 className="h-5 w-5" /> },
              { label: 'Locations', value: locations, icon: <MapPin className="h-5 w-5" /> },
              { label: 'Categories', value: categories, icon: <TrendingUp className="h-5 w-5" /> },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Three simple concepts power the exchange. Businesses post their needs or available
              stock, and our AI matching engine connects the right partners.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">I NEED</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A business publishes a product or material it wants to purchase. Define your
                product, quantity, target price, and location.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">I HAVE</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A business publishes available products, stock, surplus materials, or items it
                can supply to other businesses.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">AI Matching</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our semantic matching engine connects NEED and HAVE listings using product
                synonyms, categories, quantity, price, and location scoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">Featured Categories</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Explore listings across key business categories serving the Tamil Nadu region.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredCategories.map((cat) => {
              const Icon = categoryIcons[cat] ?? Package;
              const count = listings?.filter((l) => l.category === cat).length ?? 0;
              return (
                <Link
                  key={cat}
                  to="/marketplace"
                  className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-emerald-300 transition-all duration-200"
                >
                  <div className="h-11 w-11 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 flex items-center justify-center mb-4 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 leading-snug">{cat}</p>
                  <p className="text-xs text-slate-400 mt-1">{count} listings</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="py-14 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-white">{needCount}</p>
              <p className="text-sm text-slate-400 mt-1">NEED Listings</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{haveCount}</p>
              <p className="text-sm text-slate-400 mt-1">HAVE Listings</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{businesses}</p>
              <p className="text-sm text-slate-400 mt-1">Demo Businesses</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{locations}</p>
              <p className="text-sm text-slate-400 mt-1">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 text-emerald-600 mb-4">
            <Handshake className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Ready to discover business opportunities?</h2>
          <p className="mt-4 text-slate-600 text-lg">
            Join the exchange today and let AI-powered matching connect you with the right
            suppliers and buyers across Tamil Nadu.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/register"><Button size="lg">Get Started Free</Button></Link>
            <Link to="/login"><Button size="lg" variant="outline">Sign In</Button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-xs">
                BE
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">BIZ EXCHANGE</p>
                <p className="text-[10px] text-slate-500">AI-Powered Local B2B Business Exchange Platform</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 text-center">
              MCA College Mini Project &middot; Coimbatore, Tamil Nadu &middot; Demo data for educational purposes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
