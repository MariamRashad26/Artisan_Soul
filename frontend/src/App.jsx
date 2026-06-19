import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';
import ArtisanLayout from './components/layout/ArtisanLayout';
import LandingPage from './components/landing/LandingPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import CustomDesigner from './pages/CustomDesigner';
import Craftsmanship from './pages/Craftsmanship';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// User Dashboard Pages
import UserDashboard from './pages/user/UserDashboard';
import OrderHistory from './pages/user/OrderHistory';
import SavedDesigns from './pages/user/SavedDesigns';
import UserOrderTracking from './pages/user/UserOrderTracking';

// Admin & Artisan Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminAssignArtisan from './pages/admin/AdminAssignArtisan';
import AdminArtisans from './pages/admin/AdminArtisans';
import AdminSuppliers from './pages/admin/AdminSuppliers';
import AdminDesigns from './pages/admin/AdminDesigns';
import AdminCatalog from './pages/admin/AdminCatalog';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminLiveStudio from './pages/admin/AdminLiveStudio';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminSettings from './pages/admin/AdminSettings';
import AdminHR from './pages/admin/AdminHR';
import AdminInventory from './pages/admin/AdminInventory';
import AdminProduction from './pages/admin/AdminProduction';
import AdminFinance from './pages/admin/AdminFinance';
import AdminQuality from './pages/admin/AdminQuality';
import AdminMessages from './pages/admin/AdminMessages';

import ArtisanDashboard from './pages/artisan/ArtisanDashboard';
import ArtisanBatches from './pages/artisan/ArtisanBatches';
import ArtisanAssignedOrders from './pages/artisan/ArtisanAssignedOrders';
import ArtisanProductionUpdate from './pages/artisan/ArtisanProductionUpdate';
import ArtisanQualityCheck from './pages/artisan/ArtisanQualityCheck';
import ArtisanMessages from './pages/artisan/ArtisanMessages';
import ArtisanWorkshopClips from './pages/artisan/ArtisanWorkshopClips';
import ArtisanMaterials from './pages/artisan/ArtisanMaterials';
import ArtisanMaintenance from './pages/artisan/ArtisanMaintenance';
import ArtisanShiftClock from './pages/artisan/ArtisanShiftClock';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route element={<LandingPage />} path="/" />
              <Route element={<Layout><Home /></Layout>} path="/home" />
              <Route element={<Layout><Catalog /></Layout>} path="/catalog" />
              <Route element={<Layout><ProductDetail /></Layout>} path="/product/:id" />
              <Route element={<Layout><Cart /></Layout>} path="/cart" />
              <Route element={<Layout><UserOrderTracking /></Layout>} path="/track-order/:id" />
              <Route element={<Layout><UserOrderTracking /></Layout>} path="/track-order" />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/custom-designer" element={<CustomDesigner />} />
              <Route path="/craftsmanship" element={<Craftsmanship />} />
              <Route path="/checkout" element={<Checkout />} />

              {/* User Dashboard Routes — protected */}
              <Route
                path="/user"
                element={
                  <ProtectedRoute allowedRole="user">
                    <UserLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="tracker" element={<UserDashboard />} />
                <Route path="history" element={<OrderHistory />} />
                <Route path="designs" element={<SavedDesigns />} />
              </Route>

              {/* Admin Dashboard Routes — protected */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<AdminOrderDetail />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="assign-artisan/:id" element={<AdminAssignArtisan />} />
                <Route path="artisans" element={<AdminArtisans />} />
                <Route path="suppliers" element={<AdminSuppliers />} />
                <Route path="designs" element={<AdminDesigns />} />
                <Route path="catalog" element={<AdminCatalog />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="video" element={<AdminLiveStudio />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="hr" element={<AdminHR />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="production" element={<AdminProduction />} />
                <Route path="finance" element={<AdminFinance />} />
                <Route path="quality" element={<AdminQuality />} />
              </Route>

              {/* Artisan Dashboard Routes — protected */}
              <Route
                path="/artisan"
                element={
                  <ProtectedRoute allowedRole="artisan">
                    <ArtisanLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ArtisanDashboard />} />
                <Route path="batches" element={<ArtisanBatches />} />
                <Route path="assignments" element={<ArtisanAssignedOrders />} />
                <Route path="production/:id" element={<ArtisanProductionUpdate />} />
                <Route path="quality-check" element={<ArtisanQualityCheck />} />
                <Route path="quality-check/:id" element={<ArtisanQualityCheck />} />
                <Route path="messages" element={<ArtisanMessages />} />
                <Route path="clips" element={<ArtisanWorkshopClips />} />
                <Route path="materials" element={<ArtisanMaterials />} />
                <Route path="maintenance" element={<ArtisanMaintenance />} />
                <Route path="clock" element={<ArtisanShiftClock />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
