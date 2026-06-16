const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicalHistory: String,
  contact: String
});

module.exports = mongoose.model('PatientProfile', patientProfileSchema);