const mongoose = require('mongoose');

const CouplingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    sourceNode: { type: String, required: true },
    targetNode: { type: String, required: true },
    description: { type: String, required: true },
    weight: { type: Number, required: true },
    lagTicks: { type: Number, required: true },
    lagMinutes: { type: Number, required: true },
    threshold: { type: Number, default: 40 },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Coupling || mongoose.model('Coupling', CouplingSchema);
