import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Silver, Gold, Platinum
  price: { type: String }, // e.g., "₹24,999"
  features: [{ type: String }], // Array of included features
  isPopular: { type: Boolean, default: false }
});

const subServiceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Newborn Stories"
  slug: { type: String, required: true }, // e.g., "newborn-stories"
  description: { type: String },
  imageUrl: { type: String },
  packages: [packageSchema]
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. "Maternity Stories", "Baby Shoots"
  slug: { type: String, required: true, unique: true }, // e.g. "maternity-stories"
  description: { type: String },
  imageUrl: { type: String },
  packages: [packageSchema], // Embedded packages since they belong to a specific service
  subServices: [subServiceSchema], // Array of nested subservices
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
