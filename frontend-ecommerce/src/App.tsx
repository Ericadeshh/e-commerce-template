import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import LandingPage from "./pages/LandingPage";
import Cart from "./components/Cart/Cart";
import Footer from "./components/Footer/Footer";
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
              <Route
                path="/cart"
                element={<Cart show={false} onHide={() => {}} />}
              />
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
