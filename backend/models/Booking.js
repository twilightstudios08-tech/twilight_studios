import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  bookingType: { type: String, enum: ['Client', 'Studio'], default: 'Client' },
  isSubscription: { type: Boolean, default: false },
  studioName: { type: String }, // For Studio bookings
  babyAge: { type: String },
  shootType: { type: String, required: function() { return this.bookingType === 'Client'; } }, 
  package: { type: String, required: function() { return this.bookingType === 'Client'; } },   
  date: { type: String, required: true },      // YYYY-MM-DD
  slot: { 
    type: String, 
    enum: ['Morning', 'Afternoon', 'Evening']
  },
  slots: [{ type: String, enum: ['Morning', 'Afternoon', 'Evening'] }],
  notes: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Contacted', 'Confirmed', 'Finished', 'Cancelled'],
    default: 'Pending'
  },
  shootCompleted: { type: Boolean, default: false },
  photosDelivered: { type: Boolean, default: false },
  videosDelivered: { type: Boolean, default: false },
  // Payments
  totalAmount: { type: Number, default: 0 },
  advanceAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },
  // Follow-ups
  followUps: [{
    date: { type: Date, default: Date.now },
    note: { type: String, required: true }
  }]
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
