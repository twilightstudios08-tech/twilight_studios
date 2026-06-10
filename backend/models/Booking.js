import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  babyAge: { type: String },
  shootType: { type: String, required: true }, // e.g. "Maternity Stories", "Newborn Stories"
  package: { type: String, required: true },   // e.g. "Silver Package", "Gold Package"
  date: { type: String, required: true },      // YYYY-MM-DD
  slot: { 
    type: String, 
    enum: ['Morning', 'Afternoon', 'Evening'],
    required: true 
  },
  notes: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
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
