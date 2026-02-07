const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

const DB_FILE = "./db.json";

// ---------- helpers ----------
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ crops: [], prices: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ---------- HOME ----------
app.get("/", (req, res) => {
  res.send("🌾 Oru Village – Oru Market backend running");
});

// ---------- ADMIN ----------
app.post("/admin/login", (req, res) => {
  if (req.body.pass === "8610694904") {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
});

app.post("/admin/price", (req, res) => {
  const db = readDB();
  db.prices[req.body.crop] = req.body.price;
  writeDB(db);
  res.json({ success: true });
});

app.get("/price/:crop", (req, res) => {
  const db = readDB();
  res.json({ price: db.prices[req.params.crop] || "Not updated" });
});

// ---------- TECH PERSON ----------
app.post("/crop", (req, res) => {
  const db = readDB();
  db.crops.push(req.body);
  writeDB(db);
  res.json({ success: true });
});

app.delete("/crop/:id", (req, res) => {
  const db = readDB();
  const crop = db.crops[req.params.id];

  if (!crop) return res.status(404).json({ error: "Not found" });
  if (crop.techPhone !== req.body.techPhone)
    return res.status(403).json({ error: "Not allowed" });

  db.crops.splice(req.params.id, 1);
  writeDB(db);
  res.json({ success: true });
});

// ---------- BUYER ----------
app.get("/crops", (req, res) => {
  const db = readDB();
  res.json(db.crops);
});

// ---------- PORT ----------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Backend running on " + PORT));
