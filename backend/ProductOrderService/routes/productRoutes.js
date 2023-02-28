import express from "express";
import Product from "../models/productModel.js";

const productRouter = express.Router();

productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.post("/", async (req, res) => {
  const { title, image, description, price, countInStock } = req.body;
  if (
    title == null ||
    image == null ||
    description == null ||
    price == null ||
    countInStock == null
  ) {
    res.status(400).send("Missing data");
  } else {
    const result = {
      title: title,
      image: image,
      description: description,
      price: price,
      countInStock: countInStock,
    };
    await Product.insertMany(result);
    res.send(result);
  }
});

productRouter.delete("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.delete();
    res.send("Deleted");
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

productRouter.put("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
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
    await product.save();
    res.send(product);
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

export default productRouter;
