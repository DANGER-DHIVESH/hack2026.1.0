const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let crops = [];
let marketPrices = {};

// ---------- ADMIN ----------
app.post("/admin/price", (req, res) => {
  const { crop, price } = req.body;
  marketPrices[crop] = price;
  res.json({ success: true });
});

app.get("/price/:crop", (req, res) => {
  res.json({ price: marketPrices[req.params.crop] || "Not updated" });
});

// ---------- TECH PERSON ----------
app.post("/crop", (req, res) => {
  crops.push(req.body);
  res.json({ success: true });
});

// Tech person ONLY delete
app.delete("/crop/:id", (req, res) => {
  const { techPhone } = req.body;
  if (!crops[req.params.id]) {
    return res.status(404).json({ error: "Not found" });
  }
  if (crops[req.params.id].techPhone !== techPhone) {
    return res.status(403).json({ error: "Not allowed" });
  }
  crops.splice(req.params.id, 1);
  res.json({ success: true });
});

// ---------- BUYER ----------
app.get("/crops", (req, res) => {
  res.json(crops);
});

// ---------- START ----------
app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
