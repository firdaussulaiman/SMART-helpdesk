const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  microsoftId:   { type: String, unique: true, required: true },
  displayName:   String,
  email:         { type: String, unique: true, required: true },
  givenName:     String,
  surname:       String,
  role:          { type: String, enum: ['user','admin'], default: 'user' },
  refreshTokens: [String]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);