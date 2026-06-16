const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: String,
  bio: String,
  contact: String
});

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);