import express from "express";
import data from "../data.js";

const orderRouter = express.Router();

class Order {
  constructor(orderid, productId) {
    (this.orderid = orderid), (this.productId = productId);
  }
}

orderRouter.post("/", (req, res) => {
  const { orderid, productId } = req.body;
  const product = data.products.find((product) => product.id == productId);
  if (productId == null) {
    res.status(400).send("missing");
  } else if (product.countInStock == 0) {
    res.status(404).send("Product not found");
  } else {
    const result = new Order(orderid, productId);
    data.orders.push(result);
    product.countInStock--;
    res.send("Order placed");
  }
});

orderRouter.get("/", (req, res) => {
  res.send(data.orders);
});

orderRouter.get("/:id", (req, res) => {
  const order = data.orders.find((o) => o.orderId == req.params.id);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ message: "Order not found" });
  }
});

export default orderRouter;
