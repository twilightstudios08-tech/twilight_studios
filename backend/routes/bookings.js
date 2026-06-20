import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filenamePath = fileURLToPath(import.meta.url);
const __dirnamePath = path.dirname(__filenamePath);
const logoPath = path.join(__dirnamePath, '../../frontend/public/images/logo.png');

import Booking from '../models/Booking.js';
import SlotCapacity from '../models/Slot.js';
import nodemailer from 'nodemailer';
import Settings from '../models/Settings.js';

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

// Create a multi-slot Studio booking
router.post('/studio', async (req, res) => {
  try {
    const { name, studioName, email, phone, date, slots } = req.body;

    if (!slots || slots.length === 0) {
      return res.status(400).json({ error: 'At least one slot must be selected.' });
    }

    // 1. Validate capacity for ALL requested slots
    for (const slot of slots) {
      const slotRecord = await SlotCapacity.findOne({ date, slot });
      if (slotRecord && slotRecord.currentBookings >= slotRecord.maxCapacity) {
        return res.status(400).json({ error: `Slot ${slot} is fully booked on ${date}.` });
      }
    }

    // 2. Create ONE booking with the array of slots
    const booking = new Booking({
      name,
      email,
      phone,
      bookingType: 'Studio',
      studioName,
      date,
      slots,
      // Optional default fallbacks for schema
      shootType: 'Studio Session',
      package: studioName || 'Studio Booking',
      status: 'Confirmed'
    });
    await booking.save();

    // 3. Update capacity for each slot
    for (const slot of slots) {
      let slotRecord = await SlotCapacity.findOne({ date, slot });
      if (slotRecord) {
        slotRecord.currentBookings += 1;
        await slotRecord.save();
      } else {
        slotRecord = new SlotCapacity({
          date, slot, currentBookings: 1
        });
        await slotRecord.save();
      }
    }

    res.status(201).json({ message: 'Studio booked successfully', booking });
  } catch (error) {
    console.error('Error creating studio booking:', error);
    res.status(500).json({ error: 'Server error creating studio booking' });
  }
});

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, babyAge, shootType, package: pkg, date, slot, notes } = req.body;

    // Check capacity first
    let slotRecord = await SlotCapacity.findOne({ date, slot });
    
    if (slotRecord && slotRecord.currentBookings >= slotRecord.maxCapacity) {
      return res.status(400).json({ error: 'Slot is fully booked' });
    }

    // Create booking
    const booking = new Booking({
      name, email, phone, babyAge, shootType, package: pkg, date, slot, notes
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

    // Try sending email
    try {
      if ((process.env.SMTP_USER || process.env.EMAIL_USER) && (process.env.SMTP_PASS || process.env.EMAIL_PASS)) {
        const authUser = process.env.SMTP_USER || process.env.EMAIL_USER;
        const authPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: authUser,
            pass: authPass
          }
        });

        const settings = await Settings.findOne() || {};
        const teamEmails = settings.teamEmails && settings.teamEmails.length > 0 
          ? settings.teamEmails 
          : [settings.contactEmail || 'hello@imazenstudios.in'];

        const emailHtml = `
          <img src="cid:imazenlogo" alt="Imazen Studios" style="max-width: 150px; height: auto; margin-bottom: 20px;" />
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Shoot Type:</strong> ${shootType}</p>
          <p><strong>Package:</strong> ${pkg}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Slot:</strong> ${slot}</p>
          <p><strong>Baby Age:</strong> ${babyAge || 'N/A'}</p>
          <p><strong>Notes:</strong> ${notes || 'N/A'}</p>
        `;

        // Send to Client
        const clientEmailHtml = `
          <div style="background-color: #0a0a0a; padding: 40px 30px; font-family: Arial, sans-serif; color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 8px;">
            <div style="margin-bottom: 40px;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: bold; letter-spacing: 1px;">
                <!-- [LOGO PLACEHOLDER] -->
                Imazen Studios.
              </h1>
            </div>
            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 25px; color: #e5e5e5;">
              Hi ${name},
            </p>
            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 25px; color: #e5e5e5;">
              We have received your booking request for <strong style="color: #ffffff;">${shootType}</strong>. We are thrilled to capture your special moments!
            </p>
            <table style="width: 100%; margin-bottom: 30px; border-collapse: collapse; font-size: 14px; color: #e5e5e5;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);"><strong>Date:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);"><strong>Slot:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right;">${slot}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);"><strong>Package:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right;">${pkg}</td>
              </tr>
            </table>
            <p style="font-size: 13px; color: #a3a3a3; margin-bottom: 40px;">
              Need to contact us? Reach out directly:<br/>
              <span style="font-size: 16px; font-weight: bold; color: #ffffff; display: block; margin: 10px 0;">${settings.whatsappNumber || '+91 99999 99999'}</span>
              <a href="tel:${(settings.whatsappNumber || '+919999999999').replace(/\s/g, '')}" style="color: #ffffff; text-decoration: underline; margin-right: 15px;">📞 Call</a>
              <a href="https://wa.me/${(settings.whatsappNumber || '919999999999').replace(/\D/g, '')}" style="color: #ffffff; text-decoration: underline;">💬 WhatsApp</a>
            </p>
            <p style="font-size: 15px; line-height: 1.6; color: #e5e5e5;">
              Our team will review your request and be in touch shortly to confirm your slot.
            </p>
            <div style="margin-top: 50px; font-size: 11px; color: #737373; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
              <p>Imazen Studios</p>
              <p>Follow the link to opt out of future emails: <a href="#" style="color: #a3a3a3;">Click here to unsubscribe</a></p>
            </div>
          </div>
        `;

        transporter.sendMail({
          from: `"Imazen Studios" <${authUser}>`,
          to: email,
          subject: 'Your Imazen Studios Booking Request',
          html: clientEmailHtml
        }).catch(e => console.error('Client email failed:', e));

        // Send to Team
        transporter.sendMail({
          from: `"Imazen Studios System" <${authUser}>`,
          to: teamEmails.join(', '),
          subject: `New Booking: ${shootType} on ${date}`,
          html: emailHtml
        }).catch(e => console.error('Team email failed:', e));
      } else {
        console.warn('Email credentials not configured. Emails were not sent.');
      }
    } catch (emailError) {
      console.error('Failed to send emails:', emailError);
    }

    res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (error) {
    console.error(error);
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

// Admin: Update booking full details
router.put('/:id/details', async (req, res) => {
  try {
    const updateData = req.body;
    const existingBooking = await Booking.findById(req.params.id);
    if (!existingBooking) return res.status(404).json({ error: 'Booking not found' });

    // Handle Slot Capacity changes if date/slot is changed
    if (updateData.date && updateData.slot && 
       (existingBooking.date !== updateData.date || existingBooking.slot !== updateData.slot)) {
       
       updateData.slotHistory = [...(existingBooking.slotHistory || [])];
       updateData.slotHistory.push({
         oldDate: existingBooking.date,
         oldSlot: existingBooking.slot,
         newDate: updateData.date,
         newSlot: updateData.slot,
         changedAt: new Date()
       });

       // Decrement old slot
       let oldSlotRecord = await SlotCapacity.findOne({ date: existingBooking.date, slot: existingBooking.slot });
       if (oldSlotRecord && oldSlotRecord.currentBookings > 0) {
         oldSlotRecord.currentBookings -= 1;
         await oldSlotRecord.save();
       }

       // Increment new slot
       let newSlotRecord = await SlotCapacity.findOne({ date: updateData.date, slot: updateData.slot });
       if (!newSlotRecord) {
         newSlotRecord = new SlotCapacity({
           date: updateData.date, slot: updateData.slot, currentBookings: 1
         });
       } else {
         newSlotRecord.currentBookings += 1;
       }
       await newSlotRecord.save();
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating booking details' });
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

// Admin: Update a follow-up note
router.put('/:id/followups/:noteId', async (req, res) => {
  try {
    const { note } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, "followUps._id": req.params.noteId },
      { $set: { "followUps.$.note": note } },
      { returnDocument: 'after' }
    );
    if (!booking) return res.status(404).json({ error: 'Booking or note not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating follow-up note' });
  }
});

// Admin: Delete a follow-up note
router.delete('/:id/followups/:noteId', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $pull: { followUps: { _id: req.params.noteId } } },
      { returnDocument: 'after' }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting follow-up note' });
  }
});

// Admin: Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    
    // Decrement slot capacity
    if (booking.slots && booking.slots.length > 0) {
      for (const slot of booking.slots) {
        let slotRecord = await SlotCapacity.findOne({ date: booking.date, slot });
        if (slotRecord && slotRecord.currentBookings > 0) {
          slotRecord.currentBookings -= 1;
          await slotRecord.save();
        }
      }
    } else if (booking.slot) {
      let slotRecord = await SlotCapacity.findOne({ date: booking.date, slot: booking.slot });
      if (slotRecord && slotRecord.currentBookings > 0) {
        slotRecord.currentBookings -= 1;
        await slotRecord.save();
      }
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
