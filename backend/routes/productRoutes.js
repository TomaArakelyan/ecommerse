import express from "express";
import data from "../data.js";

const productRouter = express.Router();

class Product {
  constructor(id, title, image, description, price, countInStock) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.description = description;
    this.price = price;
    this.countInStock = countInStock;
  }
}

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
    const result = new Product(
      id,
      title,
      image,
      description,
      price,
      countInStock
    );
    data.products.push(result);
    res.send("Product Created");
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
    res.send("Product updated");
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

export default productRouter;
