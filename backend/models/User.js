import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['patient', 'doctor', 'admin'], 
    default: 'patient' 
  },
  gender: { type: String },
  age: { type: Number },
  address: { type: String },
  isActive: { type: Boolean, default: true },
  
  // Doctor-specific fields (optional)
  specialization: { type: String },
  experience: { type: String },
  qualification: { type: String },
  consultationFee: { type: Number }
}, { timestamps: true });

export default mongoose.model('User', userSchema);