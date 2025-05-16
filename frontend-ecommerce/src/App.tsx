import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Cart from "./components/Cart/Cart"; // Import from separate file
import LandingPage from "./pages/LandingPage";
import "./App.css";

function App() {
  const [cartVisible, setCartVisible] = useState(false);

  return (
    <Router>
      <Header onCartClick={() => setCartVisible(true)} />
      <Cart show={cartVisible} onHide={() => setCartVisible(false)} />

      <main className="container-fluid mt-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Add more routes here */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
