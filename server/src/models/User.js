const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, default: '' },
      role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
      ward: { type: String, default: '' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('User', userSchema);
