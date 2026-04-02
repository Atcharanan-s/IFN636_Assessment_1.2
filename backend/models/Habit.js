const mongoose = require('mongoose');

const completionSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true, // YYYY-MM-DD
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly'],
      default: 'daily',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    completionHistory: {
      type: [completionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);