import express from "express";
import Session from "../models/sessionModel.js";

const sessionRouter = express.Router();

sessionRouter.post("/", async (req, res) => {
  try {
    const { userId, cart_items } = req.body;
    const session = new Session({
      session: req.session,
      userId,
      last_login: new Date(),
      cart_items: req.body.cart_items.map((x) => ({ ...x, product: x._id })),
    });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Unable to create session" });
  }
});

sessionRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const session = await Session.findOne({ userId }).sort({ createdAt: -1 });
    res.json({ session });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Unable to get session data" });
  }
});

sessionRouter.patch("/:id", async (req, res) => {
  try {
    const { cart_items } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    (session.cart_items = cart_items.map((x) => ({ ...x, product: x._id }))),
      await session.save();

    res.status(200).json(session);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Unable to update session" });
  }
});

export default sessionRouter;
