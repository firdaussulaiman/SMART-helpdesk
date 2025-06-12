const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Ticket = require('../models/Ticket');

// Protected GET /api/tickets
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching tickets' });
  }
});

module.exports = router;
