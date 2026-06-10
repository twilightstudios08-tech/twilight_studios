import mongoose from 'mongoose';

const galleryCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('GalleryCategory', galleryCategorySchema);
