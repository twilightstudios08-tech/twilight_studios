import mongoose from 'mongoose';

// This model tracks how many bookings exist for a specific date and slot
const slotCapacitySchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  slot: { 
    type: String, 
    enum: ['Morning', 'Afternoon', 'Evening'],
    required: true 
  },
  currentBookings: { type: Number, default: 0 },
  maxCapacity: { type: Number, default: 3 }
}, { timestamps: true });

// Ensure unique index on date + slot combination
slotCapacitySchema.index({ date: 1, slot: 1 }, { unique: true });

export default mongoose.model('SlotCapacity', slotCapacitySchema);
