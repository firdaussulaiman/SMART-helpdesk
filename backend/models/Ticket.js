const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: String,
  category: String,
  status: { type: String, default: 'Open' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ticket', ticketSchema);
