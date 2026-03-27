const express = require('express');
const router = express.Router();

// Mock DB array (replace with real DB queries)
let riders = [];

// GET all riders
router.get('/', (req, res) => {
    res.json(riders);
});

// POST a new rider
router.post('/', (req, res) => {
    const newRider = req.body;
    newRider.rider_id = riders.length + 1; // simple ID generator
    riders.push(newRider);
    res.status(201).json(newRider);
});

// DELETE a rider by ID
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    riders = riders.filter(r => r.rider_id !== id);
    res.status(204).send();
});

module.exports = router;
