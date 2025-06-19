// File: backend/routes/ticketRoutes.js
const express = require('express');
const Ticket = require('../models/Ticket');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

// GET all tickets — any authenticated user
router.get('/', authenticateToken, async (req, res) => {
  // Optionally filter: e.g., req.user.role === 'user' ? find user-specific tickets
  const tickets = await Ticket.find();
  res.json(tickets);
});

// POST new ticket — allow 'user' and 'admin'
router.post('/', authenticateToken, authorizeRoles('user', 'admin'), async (req, res) => {
  const ticket = new Ticket({ ...req.body });
  await ticket.save();
  res.status(201).json(ticket);
});

// PUT update ticket — admins only
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const updated = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Ticket not found' });
  res.json(updated);
});

// DELETE ticket — admins only
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  await Ticket.findByIdAndDelete(req.params.id);
  res.json({ message: 'Ticket deleted' });
});

module.exports = router;
