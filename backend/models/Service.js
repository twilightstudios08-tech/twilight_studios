import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Silver, Gold, Platinum
  price: { type: String }, // e.g., "₹24,999"
  features: [{ type: String }], // Array of included features
  isPopular: { type: Boolean, default: false }
});

const faqSchema = new mongoose.Schema({
  question: { type: String },
  answer: { type: String }
});

const featureSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String }
});

const subServiceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Pre Wedding", "Maternity"
  slug: { type: String, required: true },
  description: { type: String },
  slotsActive: { type: Boolean, default: true },
  imageUrl: { type: String },
  heroImage: { type: String },
  mobileHeroImage: { type: String },
  portfolioImages: [{ url: String, _id: false }],
  portfolioVideos: [{ url: String, thumbnail: String, _id: false }],
  packages: [packageSchema],
  landingAbout: {
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String }
  },
  features: [featureSchema],
  faqs: [faqSchema]
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Maternity Stories", "Baby Shoots"
  slug: { type: String, required: true, unique: true }, // e.g. "maternity-stories"
  order: { type: Number, default: 0 },
  slotsActive: { type: Boolean, default: true },
  tagline: { type: String }, // e.g. "Capturing Moments That Last Forever"
  description: { type: String },
  imageUrl: { type: String },
  heroImage: { type: String },
  mobileHeroImage: { type: String },
  portfolioImages: [{ type: String }],
  portfolioVideos: [{ type: String }],
  packages: [packageSchema], // Embedded packages since they belong to a specific service
  landingAbout: {
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String }
  },
  features: [featureSchema],
  faqs: [faqSchema],
  subServices: [subServiceSchema], // Array of nested subservices
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
