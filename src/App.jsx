import {
  lazy,
  Suspense,
} from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import AdminRoute from "./components/AdminRoute";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

const HomePage = lazy(
  () => import("./pages/HomePage"),
);

const ProductsPage = lazy(
  () => import("./pages/ProductsPage"),
);

const ProductDetail = lazy(
  () => import("./pages/ProductDetail"),
);

const CartPage = lazy(
  () => import("./pages/CartPage"),
);

const LoginPage = lazy(
  () => import("./pages/LoginPage"),
);

const RegisterPage = lazy(
  () => import("./pages/RegisterPage"),
);

const ProfilePage = lazy(
  () => import("./pages/ProfilePage"),
);

const WishlistPage = lazy(
  () => import("./pages/WishlistPage"),
);

const CheckoutPage = lazy(
  () => import("./pages/CheckoutPage"),
);

const OrderConfirmationPage = lazy(
  () => import("./pages/OrderConfirmationPage"),
);

const OrdersPage = lazy(
  () => import("./pages/OrdersPage"),
);

const NotFoundPage = lazy(
  () => import("./pages/NotFoundPage"),
);

const AdminPage = lazy(
  () => import("./pages/admin/AdminPage"),
);

const AdminProducts = lazy(
  () => import("./pages/admin/AdminProducts"),
);

const AdminProductForm = lazy(
  () => import("./pages/admin/AdminProductForm"),
);

const AdminProductOptions = lazy(
  () => import("./pages/admin/AdminProductOptions"),
);

const AdminCoupons = lazy(
  () => import("./pages/admin/AdminCoupons"),
);

const AdminCouponForm = lazy(
  () => import("./pages/admin/AdminCouponForm"),
);

const AdminOrders = lazy(
  () => import("./pages/admin/AdminOrders"),
);

function PageLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] items-center justify-center bg-brand-black px-6"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          aria-hidden="true"
          className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-brand-lime"
        />

        <span className="text-xs uppercase tracking-[0.25em] text-brand-muted">
          Carregando...
        </span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/vhx-store">
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col bg-brand-black">
              <Navbar />

              <main className="flex-1">
                <Suspense fallback={<PageLoading />}>
                  <Routes>
                    <Route
                      path="/"
                      element={<HomePage />}
                    />

                    <Route
                      path="/produtos"
                      element={<ProductsPage />}
                    />

                    <Route
                      path="/produtos/:id"
                      element={<ProductDetail />}
                    />

                    <Route
                      path="/carrinho"
                      element={<CartPage />}
                    />

                    <Route
                      path="/login"
                      element={<LoginPage />}
                    />

                    <Route
                      path="/cadastro"
                      element={<RegisterPage />}
                    />

                    <Route
                      path="/perfil"
                      element={<ProfilePage />}
                    />

                    <Route
                      path="/wishlist"
                      element={<WishlistPage />}
                    />

                    <Route
                      path="/checkout"
                      element={<CheckoutPage />}
                    />

                    <Route
                      path="/pedido/:id"
                      element={
                        <OrderConfirmationPage />
                      }
                    />

                    <Route
                      path="/pedidos"
                      element={<OrdersPage />}
                    />

                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminPage />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/pedidos"
                      element={
                        <AdminRoute>
                          <AdminOrders />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/produtos"
                      element={
                        <AdminRoute>
                          <AdminProducts />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/produtos/novo"
                      element={
                        <AdminRoute>
                          <AdminProductForm />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/produtos/:id/editar"
                      element={
                        <AdminRoute>
                          <AdminProductForm />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/produtos/:id/opcoes"
                      element={
                        <AdminRoute>
                          <AdminProductOptions />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/cupons"
                      element={
                        <AdminRoute>
                          <AdminCoupons />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/cupons/novo"
                      element={
                        <AdminRoute>
                          <AdminCouponForm />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="/admin/cupons/:id/editar"
                      element={
                        <AdminRoute>
                          <AdminCouponForm />
                        </AdminRoute>
                      }
                    />

                    <Route
                      path="*"
                      element={<NotFoundPage />}
                    />
                  </Routes>
                </Suspense>
              </main>

              <Footer />
            </div>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}