import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import orderRouter from "./routes/orderRoutes.js";
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

app.use("/api/orders", orderRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = 3002;

app.listen(port, () => {
  console.log(`Listening to port:  ${port}`);
});
