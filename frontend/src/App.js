import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomeScreen from "./views/home";
import ProductScreen from "./views/product";
import LoginScreen from "./views/login";
import { useContext } from "react";
import { Store } from "./Store";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import CartScreen from "./views/cart";

function App() {
  const { state } = useContext(Store);
  const { cart } = state;
  return (
    <BrowserRouter>
      <div>
        <header>
          <Nav className="me-auto">
            <Link to="/">
              <img
                className="logo"
                src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*9hcinRdaHicrNpNE.jpg"
                alt="logo"
              />
            </Link>
            <Link to="/cart" className="add-to-cart" color="ffffff">
              Cart
              {cart.cartItems.length > 0 && (
                <Badge pill bg="danger">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </Badge>
              )}
            </Link>
          </Nav>
        </header>
        <main>
          <Routes>
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/cart" element={<CartScreen />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
