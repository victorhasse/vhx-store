import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage      from './pages/HomePage'
import ProductsPage  from './pages/ProductsPage'
import ProductDetail from './pages/ProductDetail'
import CartPage      from './pages/CartPage'
import LoginPage     from './pages/LoginPage'
import RegisterPage  from './pages/RegisterPage'
import NotFoundPage  from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter basename="/vhx-store">
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-brand-black">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/"            element={<HomePage />} />
                <Route path="/produtos"    element={<ProductsPage />} />
                <Route path="/produtos/:id" element={<ProductDetail />} />
                <Route path="/carrinho"    element={<CartPage />} />
                <Route path="/login"       element={<LoginPage />} />
                <Route path="/cadastro"    element={<RegisterPage />} />
                <Route path="*"            element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}