import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  section: { type: String, required: true, unique: true }, // e.g., 'Hero', 'About', 'Contact'
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Content', contentSchema);
