const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema(
  {
    incidentId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, required: true },
    signatureVector: [{ type: Number }], // Early stress vector sequence for similarity matching
    timeToPeakMinutes: { type: Number, required: true },
    peakCriticalNodes: { type: Number, default: 0 },
    recommendedPlaybook: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Incident || mongoose.model('Incident', IncidentSchema);
