import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  // Common fields
  phone: String,
  gender: String,
  age: Number,
  address: String,
  isActive: { type: Boolean, default: true },
  
  // Doctor-specific fields
  specialization: { type: String },
  experience: { type: String },
  qualification: { type: String },
  consultationFee: { type: Number }
});

export default mongoose.model('User', userSchema);