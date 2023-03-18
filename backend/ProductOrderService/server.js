import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import orderRouter from "./routes/orderRoutes.js";
import productRouter from "./routes/productRoutes.js";
import sessionRouter from "./routes/sessionRoutes.js";
import serverLog from "./models/serverLogModel.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(async (req, res, next) => {
  const log = new serverLog({
    requestMethod: req.method,
    requestPath: req.path,
    server: process.env.SERVER_NAME,
  });
  await log.save();
  console.log(process.env.SERVER_NAME);
  console.log(req.path);
  next();
});

app.get("/logs", async (req, res) => {
  const logs = await serverLog.find();
  res.send(logs);
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
