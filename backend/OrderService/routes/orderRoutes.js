import express from "express";
import Order from "../models/orderModel.js";
import { isAuth } from "../utils.js";
import axios from "axios";


const orderRouter = express.Router();


orderRouter.post("/", isAuth, async (req, res) => {
  const productIds = req.body.orderItems.map(x => x._id);
  const productResponse = await axios.get(`${process.env.PRODUCTSERVICEURL}/products`, { params: { ids: productIds.join(',') } });
  const products = productResponse.data;
  const newOrder = new Order({
    orderItems: req.body.orderItems.map((x, i) => ({
      product: products[i]._id,
      name: products[i].title,
      image: products[i].image,
      price: products[i].price,
      countInStock: products[i].countInStock,
      quantity: x.quantity,
    })),
    shippingAddress: req.body.shippingAddress,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    taxPrice: req.body.taxPrice,
    totalPrice: req.body.totalPrice,
    userId: req.body.userId,
  });
  const order = await newOrder.save();
  res.status(201).send({ message: "New Order Created", order });
});

orderRouter.get("/myOrders", isAuth, async (req, res) => {
  const orders = await Order.find({ userId: req.query.userId });
  res.send(orders);
});

orderRouter.get("/", async (req, res) => {
  const order = await Order.find();
  res.send(order);
});

orderRouter.get("/:id", isAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ message: "Order Not Found" });
  }
});

orderRouter.delete("/:id", isAuth, async (req, res) => {
  const order = await Order.findById(req.user.id);
  if (order) {
    await order.delete();
    res.send("Deleted");
  } else {
    res.status(404).send({ message: "Order not found" });
  }
});
export default orderRouter;
