const express = require('express');
const router = express.Router();

let coaches = [];

// GET all coaches
router.get('/', (req, res) => {
    res.json(coaches);
});

// POST a new coach
router.post('/', (req, res) => {
    const newCoach = req.body;
    newCoach.coach_id = coaches.length + 1;
    coaches.push(newCoach);
    res.status(201).json(newCoach);
});

// DELETE a coach
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    coaches = coaches.filter(c => c.coach_id !== id);
    res.status(204).send();
});

module.exports = router;