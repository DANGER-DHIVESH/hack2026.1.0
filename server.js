const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// FILE PATHS
const CROPS_FILE = "./crops.json";
const PRICE_FILE = "./prices.json";

// LOAD DATA
let crops = fs.existsSync(CROPS_FILE)
  ? JSON.parse(fs.readFileSync(CROPS_FILE))
  : [];

let marketPrices = fs.existsSync(PRICE_FILE)
  ? JSON.parse(fs.readFileSync(PRICE_FILE))
  : {};

// SAVE FUNCTIONS
const saveCrops = () =>
  fs.writeFileSync(CROPS_FILE, JSON.stringify(crops, null, 2));

const savePrices = () =>
  fs.writeFileSync(PRICE_FILE, JSON.stringify(marketPrices, null, 2));

// HOME
app.get("/", (req, res) => {
  res.send("🌾 Backend running with file storage");
});

// ADMIN – update price
app.post("/admin/price", (req, res) => {
  const { crop, price } = req.body;
  marketPrices[crop] = price;
  savePrices();
  res.json({ success: true });
});

app.get("/price/:crop", (req, res) => {
  res.json({ price: marketPrices[req.params.crop] || "Not updated" });
});

// TECH – add crop
app.post("/crop", (req, res) => {
  crops.push(req.body);
  saveCrops();
  res.json({ success: true });
});

// TECH – delete (owner only)
app.delete("/crop/:id", (req, res) => {
  const { techPhone } = req.body;
  if (!crops[req.params.id])
    return res.status(404).json({ error: "Not found" });

  if (crops[req.params.id].techPhone !== techPhone)
    return res.status(403).json({ error: "Not allowed" });

  crops.splice(req.params.id, 1);
  saveCrops();
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
