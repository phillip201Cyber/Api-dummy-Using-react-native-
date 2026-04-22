const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Example endpoint
app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "Yi Jin (John)" }, 
    { id: 2, name: "Angel Trujillo" }
  ]);
});

// POST endpoint
app.post("/api/users", (req, res) => {
  const user = req.body;
  res.json({ message: "User created", user });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});