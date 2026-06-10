import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  blockedWeekdays: { 
    type: [Number], 
    default: [],
    // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
  },
  metaPixelId: { type: String, default: '' },
  googleAnalyticsId: { type: String, default: '' },
  contactEmail: { type: String, default: 'hello@twilightstudios.in' },
  whatsappNumber: { type: String, default: '+919999999999' }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
