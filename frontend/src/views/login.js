import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import Axios from "axios";
import { getError } from "../utils";
import { toast } from "react-toastify";

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const apiURL = process.env.REACT_APP_USERSERVICEURL;
      const { data } = await Axios.post(`${apiURL}/users/signin`, {
        email,
        password,
      });
      const sessionData = await Axios.post(
        `${process.env.REACT_APP_PRODUCTSERVICEURL}/session`,
        {
          userId: data.id,
          cart_items: cart.cartItems,
        }
      );
      localStorage.setItem("sessionInfo", JSON.stringify(sessionData));

      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Log in</title>
      </Helmet>
      <h1 className="my-3">Log In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign In</Button>
        </div>
        <div className="mb-3">
          Don't have account?{" "}
          <Link to={`/signup?redirect=${redirect}`}>Sign up</Link>
        </div>
      </Form>
    </Container>
  );
}
