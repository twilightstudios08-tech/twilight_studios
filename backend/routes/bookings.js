import express from 'express';
import Booking from '../models/Booking.js';
import SlotCapacity from '../models/Slot.js';

const router = express.Router();

// Get available slots for a given date
router.get('/slots/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const slots = ['Morning', 'Afternoon', 'Evening'];
    const availability = [];

    for (let slot of slots) {
      let slotRecord = await SlotCapacity.findOne({ date, slot });
      if (!slotRecord) {
        // If no record exists, it means 0 bookings, capacity is full 3
        availability.push({ slot, capacity: 3, status: 'Available' });
      } else {
        const remaining = slotRecord.maxCapacity - slotRecord.currentBookings;
        availability.push({ 
          slot, 
          capacity: remaining, 
          status: remaining > 0 ? 'Available' : 'Fully Booked' 
        });
      }
    }

    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching slots' });
  }
});

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const { name, phone, babyAge, shootType, package: pkg, date, slot, notes } = req.body;

    // Check capacity first
    let slotRecord = await SlotCapacity.findOne({ date, slot });
    
    if (slotRecord && slotRecord.currentBookings >= slotRecord.maxCapacity) {
      return res.status(400).json({ error: 'Slot is fully booked' });
    }

    // Create booking
    const booking = new Booking({
      name, phone, babyAge, shootType, package: pkg, date, slot, notes
    });
    await booking.save();

    // Update capacity
    if (slotRecord) {
      slotRecord.currentBookings += 1;
      await slotRecord.save();
    } else {
      slotRecord = new SlotCapacity({
        date, slot, currentBookings: 1
      });
      await slotRecord.save();
    }

    res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (error) {
    res.status(500).json({ error: 'Server error creating booking' });
  }
});

// Admin: Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
});

// Admin: Update booking status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating booking' });
  }
});

// Admin: Update payment tracking
router.put('/:id/payment', async (req, res) => {
  try {
    const { totalAmount, advanceAmount, pendingAmount } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { totalAmount, advanceAmount, pendingAmount }, 
      { returnDocument: 'after' }
    );
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating payment' });
  }
});

// Admin: Add a follow-up note
router.post('/:id/followup', async (req, res) => {
  try {
    const { note } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    
    booking.followUps.push({ note, date: new Date() });
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Server error adding follow-up' });
  }
});

// Admin: Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    
    // Decrement slot capacity
    let slotRecord = await SlotCapacity.findOne({ date: booking.date, slot: booking.slot });
    if (slotRecord && slotRecord.currentBookings > 0) {
      slotRecord.currentBookings -= 1;
      await slotRecord.save();
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting booking' });
  }
});

// Admin: Block or Open a Slot
router.put('/slots/block', async (req, res) => {
  try {
    const { date, slot, action } = req.body;
    
    let slotRecord = await SlotCapacity.findOne({ date, slot });
    
    if (!slotRecord) {
      slotRecord = new SlotCapacity({
        date, 
        slot, 
        currentBookings: 0,
        maxCapacity: action === 'block' ? 0 : 3
      });
    } else {
      slotRecord.maxCapacity = action === 'block' ? 0 : 3;
    }
    
    await slotRecord.save();
    res.json(slotRecord);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating slot capacity' });
  }
});

export default router;
