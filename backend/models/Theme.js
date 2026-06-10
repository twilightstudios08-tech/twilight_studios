import mongoose from 'mongoose';

const ThemeSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: String, required: true },
  costume: { type: String, required: true },
  image: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Theme', ThemeSchema);
