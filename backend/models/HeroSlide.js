import mongoose from 'mongoose';

const HeroSlideSchema = new mongoose.Schema({
  img: { type: String, required: true },
  mobileImg: { type: String, required: false },
  title: { type: String, required: false },
  titleOutline: { type: String, required: false },
  text: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('HeroSlide', HeroSlideSchema);
