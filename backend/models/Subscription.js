import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  duration: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Contacted', 'Confirmed', 'Finished', 'Cancelled'],
    default: 'Pending'
  },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);
