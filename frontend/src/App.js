import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomeScreen from "./views/home";
import ProductScreen from "./views/product";
import LoginScreen from "./views/login";
import { useContext } from "react";
import { Store } from "./Store";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import CartScreen from "./views/cart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import ShippingAddressScreen from "./views/shippingAddress";
import SignupScreen from "./views/signUp";
import PlaceOrderScreen from "./views/placeOrder";
import OrderScreen from "./views/order";
import OrderHistoryScreen from "./views/orderHistory";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    window.location.reload();
  };
  return (
    <BrowserRouter>
      <div>
        <ToastContainer position="bottom-center" limit={1} />
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
            {userInfo ? (
              <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>User Profile</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/orderhistory">
                  <NavDropdown.Item>Order History</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <Link
                  className="dropdown-item"
                  to="#signout"
                  onClick={signoutHandler}
                >
                  Sign Out
                </Link>
              </NavDropdown>
            ) : (
              <Link className="nav-link" to="/login">
                Sign In
              </Link>
            )}
          </Nav>
        </header>
        <main>
          <Routes>
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/shipping" element={<ShippingAddressScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />}></Route>
            <Route
              path="/orderhistory"
              element={<OrderHistoryScreen />}
            ></Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
