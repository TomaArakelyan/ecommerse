import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";

function HomeScreen() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/api/products");
      setProducts(result.data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        {" "}
        <title> Online Shop</title>
      </Helmet>
      <h1>All Shoes</h1>
      <div className="products">
        {products.map((products) => (
          <div className="product" key={products.id}>
            <Link to={`/product/${products.id}`}>
              <img
                src={products.image}
                alt={products.title}
                width="500"
                height="600"
              ></img>
            </Link>
            <div className="info">
              <Link to={`/products/${products.id}`}>
                <p>{products.title}</p>
              </Link>
              <p>
                <strong>${products.price}</strong>
              </p>

              <button className="cart"> Add to Cart </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeScreen;
