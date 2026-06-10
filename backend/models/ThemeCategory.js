import mongoose from 'mongoose';

const themeCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  coverImage: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('ThemeCategory', themeCategorySchema);
