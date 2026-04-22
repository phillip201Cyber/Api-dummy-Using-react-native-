const express = require("express");
const app = express();
app.use(express.json());

let sessions = {}; // Dummy in-memory storage

// Start a new session
app.post("/api/session/start", (req, res) => {
  const { sessionId, date, canoes } = req.body;
  sessions[sessionId] = { date, canoes, paddlers: {}, startTime: Date.now() };
  res.json({ message: "Session started", sessionId });
});

// Record live speed per canoe
app.post("/api/session/:id/speed", (req, res) => {
  const { id } = req.params;
  const { canoeId, speedKmH } = req.body;
  if (!sessions[id]) return res.status(404).json({ error: "Session not found" });
  sessions[id].canoes[canoeId] = { ...sessions[id].canoes[canoeId], speedKmH };
  res.json({ message: "Speed recorded" });
});

// Record echopaddle metrics per paddler
app.post("/api/session/:id/echopaddle", (req, res) => {
  const { id } = req.params;
  const { paddlerId, angleChanges, SPM, distancePerStroke } = req.body;
  if (!sessions[id]) return res.status(404).json({ error: "Session not found" });
  sessions[id].paddlers[paddlerId] = { angleChanges, SPM, distancePerStroke };
  res.json({ message: "Echopaddle data recorded" });
});

// Get session averages (dummy example)
app.get("/api/session/:id/averages", (req, res) => {
  const { id } = req.params;
  if (!sessions[id]) return res.status(404).json({ error: "Session not found" });
  let totalSpeed = 0;
  let count = 0;
  for (const canoe of Object.values(sessions[id].canoes)) {
    if (canoe.speedKmH) {
      totalSpeed += canoe.speedKmH;
      count++;
    }
  }
  const avgSpeed = count > 0 ? totalSpeed / count : 0;
  res.json({ averageSpeedKmH: avgSpeed });
});

app.listen(3000, () => console.log("Backend running on port 3000"));