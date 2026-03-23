// Sushi API Backend Project - Completed version

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Sushi = require("./models/Sushi");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Sushi API running");
});

// Auth routes
app.use("/api/auth", authRoutes);

// PUBLIC: GET all sushi
app.get("/sushi", async (req, res) => {
  try {
    const sushiItems = await Sushi.find();
    res.json(sushiItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUBLIC: GET sushi by ID
app.get("/sushi/:id", async (req, res) => {
  try {
    const item = await Sushi.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Sushi not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PROTECTED: POST new sushi
app.post("/sushi", authMiddleware, async (req, res) => {
  try {
    const { name, type, price } = req.body;

    if (!name || !type || price === undefined) {
      return res.status(400).json({ message: "Invalid sushi item data" });
    }

    const newItem = new Sushi({ name, type, price });
    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PROTECTED: PUT update sushi
app.put("/sushi/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Sushi.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Sushi not found" });
    }

    item.name = req.body.name ?? item.name;
    item.type = req.body.type ?? item.type;
    item.price = req.body.price ?? item.price;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PROTECTED: DELETE sushi
app.delete("/sushi/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Sushi.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Sushi not found" });
    }

    await item.deleteOne();
    res.json({ message: "Sushi deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Only start server when run directly
if (require.main === module) {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}

module.exports = app;