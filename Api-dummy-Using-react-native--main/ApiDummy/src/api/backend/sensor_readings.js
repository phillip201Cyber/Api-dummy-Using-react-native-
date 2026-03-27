const express = require('express');
const router = express.Router();

let sensorReadings = [];

// GET all readings
router.get('/', (req, res) => {
    res.json(sensorReadings);
});

// POST a new reading
router.post('/', (req, res) => {
    const newReading = req.body;
    newReading.reading_id = sensorReadings.length + 1;
    sensorReadings.push(newReading);
    res.status(201).json(newReading);
});

// DELETE a reading
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    sensorReadings = sensorReadings.filter(r => r.reading_id !== id);
    res.status(204).send();
});

module.exports = router;