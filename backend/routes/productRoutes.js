import express from "express";
import data from "../data.js";

const productRouter = express.Router();

productRouter.get("/", (req, res) => {
  res.send(data.products);
});

productRouter.get("/:id", (req, res) => {
  const product = data.products.find((p) => p.id == req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

productRouter.post("/", (req, res) => {
  const { id, title, image, description, price, countInStock } = req.body;
  if (
    id == null ||
    title == null ||
    image == null ||
    description == null ||
    price == null ||
    countInStock == null
  ) {
    res.status(400).send("Missing data");
  } else {
    const result = {
      id: id,
      title: title,
      image: image,
      description: description,
      price: price,
      countInStock: countInStock,
    };
    data.products.push(result);
    res.send(result);
  }
});

productRouter.delete("/:id", (req, res) => {
  const product = data.products.find((p) => p.id == req.params.id);
  if (product) {
    data.products.pop(product);
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

productRouter.put("/:id", (req, res) => {
  const product = data.products.find((p) => p.id == req.params.id);
  if (product) {
    if (req.body.title) {
      product.title = req.body.title;
    }
    if (req.body.image) {
      product.image = req.body.image;
    }
    if (req.body.description) {
      product.description = req.body.description;
    }
    if (req.body.price) {
      product.price = req.body.price;
    }
    if (req.body.countInStock) {
      product.countInStock = req.body.countInStock;
    }
    res.send(product);
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

export default productRouter;
