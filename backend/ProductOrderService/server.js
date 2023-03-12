import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import orderRouter from "./routes/orderRoutes.js";
import productRouter from "./routes/productRoutes.js";
import sessionRouter from "./routes/sessionRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err.message);
  });


app.use("/api/orders", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/session", sessionRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Listening to port:  ${port}`);
});
