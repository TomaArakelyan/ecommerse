import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Badge,
  Button,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import { Store } from "../Store";

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/api/products/${id}`);
      setProduct(result.data);
    };
    fetchData();
  }, [id]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const CartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product.id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };

  return (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="product-image"
            src={product.image}
            alt="product"
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroupItem>
              <Row>
                <Col> Status:</Col>
                <Col>
                  {product.countInStock > 0 ? (
                    <Badge bg="success"> In Stock</Badge>
                  ) : (
                    <Badge bg="warning"> Unavailable </Badge>
                  )}
                </Col>
              </Row>
            </ListGroupItem>
            <ListGroup.Item>
              Count in Stock: {product.countInStock}
            </ListGroup.Item>

            {product.countInStock > 0 && (
              <ListGroupItem>
                <div className="d-grid">
                  <Button variant="primary" onClick={CartHandler}>
                    Add to cart
                  </Button>
                </div>
              </ListGroupItem>
            )}
          </ListGroup>
        </Col>
        <Col md={3}></Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
