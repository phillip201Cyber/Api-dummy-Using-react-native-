const express = require('express');
const router = express.Router();

let reports = [];

// GET all reports
router.get('/', (req, res) => {
    res.json(reports);
});

// POST a new report
router.post('/', (req, res) => {
    const newReport = req.body;
    newReport.report_id = reports.length + 1;
    reports.push(newReport);
    res.status(201).json(newReport);
});

// DELETE a report
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    reports = reports.filter(r => r.report_id !== id);
    res.status(204).send();
});

module.exports = router;