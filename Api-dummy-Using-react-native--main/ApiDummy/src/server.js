// src/api/server.js
import express from "express";
import ridersRouter from "./backend/riders.js";
import sessionsRouter from "./backend/sessions.js";
import reportsRouter from "./backend/reports.js";
import coachesRouter from "./backend/coaches.js";
import sensorRouter from "./backend/sensor_readings.js";

import { HUB_IP } from "./config.js"; // optional if you need IP

const app = express();
const port = 3000;

app.use(express.json());

// API routes
app.use("/riders", ridersRouter);
app.use("/sessions", sessionsRouter);
app.use("/reports", reportsRouter);
app.use("/coaches", coachesRouter);
app.use("/sensor_readings", sensorRouter);

// Example device route (for api.js to call)
app.get("/devices", (req, res) => {
  // Here you could return real device data, or the mock for now
  res.json([{ id: "heltec-001", name: "Heltec LoRa V32", ip: HUB_IP }]);
});

app.listen(port, () => console.log(`Server running on http://${HUB_IP}:${port}`));