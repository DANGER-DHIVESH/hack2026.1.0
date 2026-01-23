const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

let crops = [];
let marketPrices = {};

// HOME
app.get("/", (req, res) => {
  res.send("🌾 Backend is running");
});

// ADMIN – update market price
app.post("/admin/price", (req, res) => {
  const { crop, price } = req.body;
  marketPrices[crop] = price;
  res.json({ success: true });
});

app.get("/price/:crop", (req, res) => {
  res.json({ price: marketPrices[req.params.crop] || "Not updated" });
});

// TECH PERSON – add crop
app.post("/crop", (req, res) => {
  crops.push(req.body);
  res.json({ success: true });
});

// TECH PERSON – delete (phone check)
app.delete("/crop/:id", (req, res) => {
  const { techPhone } = req.body;
  if (!crops[req.params.id]) return res.status(404).json({ error: "Not found" });
  if (crops[req.params.id].techPhone !== techPhone)
    return res.status(403).json({ error: "Not allowed" });
  crops.splice(req.params.id, 1);
  res.json({ success: true });
});

// BUYER – list
app.get("/crops", (req, res) => {
  res.json(crops);
});

// PORT
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
