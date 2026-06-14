import express from 'express';
import Subscription from '../models/Subscription.js';
import Booking from '../models/Booking.js';
import nodemailer from 'nodemailer';
import Settings from '../models/Settings.js';

const router = express.Router();

// Get all subscriptions
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate('bookings').sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create subscription and its associated bookings
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, duration, months } = req.body;
    
    // Create the base subscription
    const subscription = new Subscription({
      name,
      email,
      phone,
      duration,
      bookings: []
    });
    await subscription.save();

    // Create a booking for each month
    const bookingIds = [];
    for (const m of months) {
      const booking = new Booking({
        name,
        email,
        phone,
        date: m.date,
        slot: m.slot,
        shootType: m.shootType,
        package: m.package,
        bookingType: 'Client',
        isSubscription: true
      });
      await booking.save();
      bookingIds.push(booking._id);
    }

    // Update subscription with booking references
    subscription.bookings = bookingIds;
    await subscription.save();

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
        
        const clientEmailHtml = `
          <div style="background-color: #0a0a0a; padding: 40px 30px; font-family: Arial, sans-serif; color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 8px;">
            <div style="margin-bottom: 40px;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: bold; letter-spacing: 1px;">Twilight Studios.</h1>
            </div>
            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 25px; color: #e5e5e5;">Hi ${name},</p>
            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 25px; color: #e5e5e5;">
              Your subscription for <strong>${duration} Months</strong> has been successfully created. We are thrilled to capture your special moments!
            </p>
            <p style="font-size: 13px; color: #a3a3a3; margin-bottom: 40px;">
              Need to contact us? Reach out directly:<br/>
              <span style="font-size: 16px; font-weight: bold; color: #ffffff; display: block; margin: 10px 0;">${settings.whatsappNumber || '+91 99999 99999'}</span>
              <a href="tel:${(settings.whatsappNumber || '+919999999999').replace(/\s/g, '')}" style="color: #ffffff; text-decoration: underline; margin-right: 15px;">📞 Call</a>
              <a href="https://wa.me/${(settings.whatsappNumber || '919999999999').replace(/\D/g, '')}" style="color: #ffffff; text-decoration: underline;">💬 WhatsApp</a>
            </p>
            <p style="font-size: 15px; line-height: 1.6; color: #e5e5e5;">Our team will review your requested dates and be in touch shortly to confirm your slots.</p>
          </div>
        `;

        await transporter.sendMail({
          from: `"Twilight Studios" <${authUser}>`,
          to: email,
          subject: 'Your Twilight Studios Subscription',
          html: clientEmailHtml
        });
      }
    } catch (emailError) {
      console.error('Failed to send subscription email:', emailError);
    }

    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Edit subscription
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, duration, months } = req.body;
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    // Update base subscription details
    subscription.name = name;
    subscription.email = email;
    subscription.phone = phone;
    subscription.duration = duration;

    // Delete existing bookings to cleanly recreate them, or update them.
    // For robust editing, we'll delete all old bookings and recreate them.
    if (subscription.bookings && subscription.bookings.length > 0) {
      await Booking.deleteMany({ _id: { $in: subscription.bookings } });
    }

    const bookingIds = [];
    for (const m of months) {
      const booking = new Booking({
        name,
        email,
        phone,
        date: m.date,
        slot: m.slot,
        shootType: m.shootType,
        package: m.package,
        bookingType: 'Client',
        isSubscription: true,
        status: m.status || 'Pending'
      });
      await booking.save();
      bookingIds.push(booking._id);
    }

    subscription.bookings = bookingIds;
    await subscription.save();

    res.json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update subscription status
router.put('/:id/status', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    
    subscription.status = req.body.status;
    await subscription.save();
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete subscription and its associated bookings
router.delete('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    // Delete all associated bookings
    if (subscription.bookings && subscription.bookings.length > 0) {
      await Booking.deleteMany({ _id: { $in: subscription.bookings } });
    }

    await Subscription.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscription and associated bookings deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
