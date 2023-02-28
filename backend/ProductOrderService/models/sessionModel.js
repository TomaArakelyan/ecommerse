import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema(
  {
    session: Object,
    userId: Number,
    last_login: Date,
    cart_items: [
      {
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        image: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
