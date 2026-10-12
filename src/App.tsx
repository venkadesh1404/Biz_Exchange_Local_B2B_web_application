import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { AppLayout, ProtectedRoute } from '@/components/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { MarketplacePage } from '@/pages/MarketplacePage';
import { ListingDetailPage } from '@/pages/ListingDetailPage';
import { CreateListingPage } from '@/pages/CreateListingPage';
import { MatchCenterPage } from '@/pages/MatchCenterPage';
import { MyRequestsPage, IncomingRequestsPage } from '@/pages/RequestsPages';
import { BusinessProfilePage } from '@/pages/BusinessProfilePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes with app layout */}
            <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><AppLayout><MarketplacePage /></AppLayout></ProtectedRoute>} />
            <Route path="/listings/new" element={<ProtectedRoute><AppLayout><CreateListingPage /></AppLayout></ProtectedRoute>} />
            <Route path="/listings/:id" element={<ProtectedRoute><AppLayout><ListingDetailPage /></AppLayout></ProtectedRoute>} />
            <Route path="/listings/:id/edit" element={<ProtectedRoute><AppLayout><CreateListingPage /></AppLayout></ProtectedRoute>} />
            <Route path="/match-center" element={<ProtectedRoute><AppLayout><MatchCenterPage /></AppLayout></ProtectedRoute>} />
            <Route path="/requests/incoming" element={<ProtectedRoute><AppLayout><IncomingRequestsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/requests/sent" element={<ProtectedRoute><AppLayout><MyRequestsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AppLayout><BusinessProfilePage /></AppLayout></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
