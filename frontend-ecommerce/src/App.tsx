import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Cart from "./components/Cart/Cart";
import Footer from "./components/Footer/Footer";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import AdminDashboard from "./components/auth/Admin/AdminDashboard/AdminDashboard";
import UserDashboard from "./components/auth/UserDashboard";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import styles from "./App.module.css";

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <Header />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route
              path="/cart"
              element={
                <ErrorBoundary>
                  <Cart show={false} onHide={() => {}} />
                </ErrorBoundary>
              }
            />
            <Route path="/orders" element={<div>Orders Page (TBD)</div>} />
            <Route path="/wishlist" element={<div>Wishlist Page (TBD)</div>} />
            <Route path="/help-center" element={<div>Help Center (TBD)</div>} />
            <Route path="/place-order" element={<div>Place Order (TBD)</div>} />
            <Route
              path="/payment-options"
              element={<div>Payment Options (TBD)</div>}
            />
            <Route path="/delivery" element={<div>Delivery Info (TBD)</div>} />
            <Route
              path="/returns"
              element={<div>Returns & Refunds (TBD)</div>}
            />
            <Route path="/warranty" element={<div>Warranty (TBD)</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
