const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  microsoftId: { type: String, required: true, unique: true },
  email: { type: String },
  displayName: { type: String },
  givenName: { type: String },
  surname: { type: String },
  jobTitle: { type: String },
  preferredLanguage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
