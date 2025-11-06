import { Schema, model } from 'mongoose';

const violationReportSchema = new Schema({
  violation_type: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  confidence_score: {
    type: Number,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
});

export const ViolationReport = model('ViolationReport', violationReportSchema);