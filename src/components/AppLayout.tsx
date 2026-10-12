import { type ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Store, Plus, Sparkles, Inbox, Send, Building2,
  Menu, X, LogOut, Search, Bell, ChevronDown, RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { demoService } from '@/services';
import { Button } from '@/components/ui';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { to: '/marketplace', label: 'Marketplace', icon: <Store className="h-5 w-5" /> },
  { to: '/listings/new', label: 'Create Listing', icon: <Plus className="h-5 w-5" /> },
  { to: '/match-center', label: 'AI Match Center', icon: <Sparkles className="h-5 w-5" /> },
  { to: '/requests/incoming', label: 'Incoming Requests', icon: <Inbox className="h-5 w-5" /> },
  { to: '/requests/sent', label: 'My Requests', icon: <Send className="h-5 w-5" /> },
  { to: '/profile', label: 'Business Profile', icon: <Building2 className="h-5 w-5" /> },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { business, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleResetDemo = async () => {
    await demoService.reset();
    window.location.reload();
  };

  const isActive = (path: string) => {
    if (path === '/listings/new') return location.pathname === '/listings/new';
    if (path === '/profile') return location.pathname === '/profile';
    return location.pathname.startsWith(path);
  };

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-200">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          BE
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-tight">BIZ EXCHANGE</p>
          <p className="text-[10px] text-slate-500 leading-tight">AI-Powered B2B Platform</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive(item.to)
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-200 space-y-1">
        <button
          onClick={handleResetDemo}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors w-full"
        >
          <RefreshCw className="h-5 w-5" />
          Reset Demo Data
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-slate-200 flex-col fixed inset-y-0">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-white flex flex-col">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-slate-200">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link to="/marketplace" className="hidden sm:flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
                <Search className="h-4 w-4" />
                <span>Search marketplace...</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/requests/incoming" className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors" title="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500" />
              </Link>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-semibold">
                    {business?.businessName?.charAt(0) ?? 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[140px] truncate">
                    {business?.businessName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-20 py-1.5">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900 truncate">{business?.businessName}</p>
                        <p className="text-xs text-slate-500 truncate">{business?.location}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        <Building2 className="h-4 w-4" /> Business Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6">
          {children}
        </main>

        <footer className="px-4 lg:px-8 py-6 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-400">
            BIZ EXCHANGE &mdash; AI-Powered Local B2B Business Exchange Platform
          </p>
          <p className="text-xs text-slate-400 mt-1">Demo data for MCA college project &middot; Coimbatore, Tamil Nadu</p>
        </footer>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <LoginRedirect />;
  }
  return <>{children}</>;
}

function LoginRedirect() {
  const navigate = useNavigate();
  navigate('/login');
  return null;
}

export { Button };
