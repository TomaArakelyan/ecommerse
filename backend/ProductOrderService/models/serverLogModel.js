import mongoose from "mongoose";

const serverLogSchema = new mongoose.Schema(
  {
    requestMethod: { type: String },
    requestPath: { type: String },
    server: { type: String },
  },
  {
    timestamps: true,
  }
);

const serverLog = mongoose.model("Log", serverLogSchema);
export default serverLog;
