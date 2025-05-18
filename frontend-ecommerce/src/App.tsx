import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import LandingPage from "./pages/LandingPage";
import Cart from "./components/Cart/Cart";
import Footer from "./components/Footer/Footer";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import AdminDashboard from "./components/auth/AdminDashboard";
import UserDashboard from "./components/auth/UserDashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import styles from "./App.module.css";

function App() {
  const [showCart, setShowCart] = useState(false);

  const handleCartClick = () => {
    setShowCart(true);
  };

  return (
    <Router>
      <div className={styles.app}>
        <ErrorBoundary>
          <Header onCartClick={handleCartClick} />
          <main className={styles.main}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route
                path="/cart"
                element={<Cart show={false} onHide={() => {}} />}
              />
              <Route path="/orders" element={<div>Orders Page (TBD)</div>} />
              <Route
                path="/wishlist"
                element={<div>Wishlist Page (TBD)</div>}
              />
              <Route
                path="/help-center"
                element={<div>Help Center (TBD)</div>}
              />
              <Route
                path="/place-order"
                element={<div>Place Order (TBD)</div>}
              />
              <Route
                path="/payment-options"
                element={<div>Payment Options (TBD)</div>}
              />
              <Route
                path="/delivery"
                element={<div>Delivery Info (TBD)</div>}
              />
              <Route
                path="/returns"
                element={<div>Returns & Refunds (TBD)</div>}
              />
              <Route path="/warranty" element={<div>Warranty (TBD)</div>} />
            </Routes>
          </main>
          <Cart show={showCart} onHide={() => setShowCart(false)} />
          <Footer />
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
