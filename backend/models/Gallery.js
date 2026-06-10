import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Gallery', GallerySchema);
