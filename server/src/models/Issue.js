const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Water Supply',
        'Roads & Potholes',
        'Drainage & Flooding',
        'Waste Management',
        'Healthcare Infrastructure',
        'Public Transport',
        'Urban Planning & Encroachment'
      ]
    },
    image: { type: String, default: '' },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    ward: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Reported', 'Under Review', 'In Progress', 'Resolved'],
      default: 'Reported'
    },
    votes: { type: Number, default: 0 },
    department: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Issue', issueSchema);
