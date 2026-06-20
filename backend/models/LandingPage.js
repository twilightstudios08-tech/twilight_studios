import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String }
});

const faqSchema = new mongoose.Schema({
  question: { type: String },
  answer: { type: String }
});

const landingPageSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  heroSlides: [{
    imageUrl: { type: String },
    mobileImageUrl: { type: String },
    heading: { type: String },
    description: { type: String }
  }],
  heroTextAlign: { type: String, default: 'center' },
  displayVideoUrl: { type: String },
  approachSections: [{
    heading: { type: String },
    description: { type: String },
    align: { type: String, default: 'center' }
  }],
  portfolioImagesHeading: { type: String },
  portfolioImagesAlign: { type: String, default: 'center' },
  portfolioVideosHeading: { type: String },
  portfolioVideosAlign: { type: String, default: 'center' },
  whyChooseHeading: { type: String },
  featuresAlign: { type: String, default: 'left' },
  showTestimonials: { type: Boolean, default: true },
  parallaxFooter: {
    heading: { type: String },
    imageUrl: { type: String },
    align: { type: String, default: 'center' }
  },
  showPackages: { type: Boolean, default: false },
  packagesHeading: { type: String, default: "Investment" },
  selectedPackages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  customPackages: [{
    name: { type: String },
    price: { type: String },
    description: { type: String }
  }],
  features: [featureSchema],
  faqs: [faqSchema],
  portfolioImages: [{ type: String }],
  portfolioVideos: [{ type: String }],
  threeSixtyImages: [{ type: String }],
  callToActionLink: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('LandingPage', landingPageSchema);
