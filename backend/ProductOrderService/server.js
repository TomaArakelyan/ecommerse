import express from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err.message);
  });

import orderRouter from "./routes/orderRoutes.js";
import productRouter from "./routes/productRoutes.js";
import sessionRouter from "./routes/sessionRoutes.js";
app.use("/api/orders", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/session", sessionRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = 6000;

app.listen(port, () => {
  console.log(`Listening to port:  ${port}`);
});
