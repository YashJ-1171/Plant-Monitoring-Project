import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

let latestData = {
  temperature: 0,
  humidity: 0,
  soil: 0,
  ldr: 0,
  pump: "OFF",
};

let pumpCommand = "NONE";

// ✅ ESP32 posts sensor data here
app.post("/api/sensor", (req, res) => {
  const { temperature, humidity, soil, ldr, pump } = req.body;
  latestData = { temperature, humidity, soil, ldr, pump };
  console.log("📡 New data from ESP32:", latestData);
  res.sendStatus(200);
});

// ✅ Frontend fetches latest sensor data
app.get("/api/latest", (req, res) => {
  res.json(latestData);
});

// ✅ Frontend requests pump toggle
app.post("/api/pump", (req, res) => {
  const { command } = req.body; // "ON" or "OFF"
  pumpCommand = command;
  console.log("💧 Pump command:", command);
  res.json({ status: "ok", command });
});

// ✅ ESP32 checks for commands
app.get("/api/getPumpCommand", (req, res) => {
  res.json({ command: pumpCommand });
  pumpCommand = "NONE"; // reset after reading
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
