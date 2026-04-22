const express = require('express');
const router = express.Router();

let sessions = [];

// GET all sessions
router.get('/', (req, res) => {
    res.json(sessions);
});

// POST a new session
router.post('/', (req, res) => {
    const newSession = req.body;
    newSession.session_id = sessions.length + 1;
    sessions.push(newSession);
    res.status(201).json(newSession);
});

// DELETE a session
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    sessions = sessions.filter(s => s.session_id !== id);
    res.status(204).send();
});

module.exports = router;