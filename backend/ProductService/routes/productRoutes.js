import express from "express";
import Product from "../models/productModel.js";
import redis from 'redis';
import { promisify } from "util";

const url = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = redis.createClient({ 
  url
});

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);


const productRouter = express.Router();


// Modifying the method to include caching
productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});


// productRouter.get("/:id", async (req, res) => {
//   const { id } = req.params;
//   const cacheKey = `product_${id}`;
//   const cachedProduct = await getAsync(cacheKey);
//   if (cachedProduct) {
//     console.log(`Product with id ${id} found in cache`);
//     res.send(JSON.parse(cachedProduct));
//   } else {
//     console.log(`Product with id ${id} not found in cache`);
//     const product = await Product.findById(id);
//     if (product) {
//       await setAsync(cacheKey, JSON.stringify(product));
//       res.send(product);
//     } else {
//       res.status(404).send({ message: "Product not found" });
//     }
//   }
// });


// Modifying the method to include caching
productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});



// productRouter.get("/", async (req, res) => {
//   const cachedProducts = await getAsync("products");
//   if (cachedProducts) {
//     console.log("Products found in cache");
//     res.send(JSON.parse(cachedProducts));
//   } else {
//     console.log("Products not found in cache");
//     const products = await Product.find();
//     if (products) {
//       await setAsync("products", JSON.stringify(products));
//       res.send(products);
//     } else {
//       res.status(404).send({ message: "Products not found" });
//     }
//   }
// });

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
    redisClient.del("products")
    await Product.insertMany(result);
    res.send(result);
  }
});

productRouter.delete("/:id", async (req, res) => {
  const id = req.params.id
  const cacheData = `product_${id}`
  const product = await Product.findById(id);
  if (product) {
    await product.delete();
    redisClient.del(cacheData)
    res.send("Deleted");
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

productRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const cacheData = `product_${id}`
  const product = await Product.findById(id);
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
    redisClient.del(cacheData)
    res.send(product);
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

export default productRouter;
