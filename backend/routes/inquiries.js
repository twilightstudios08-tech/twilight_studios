import express from 'express';
import Inquiry from '../models/Inquiry.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configure Nodemailer transporter lazily to ensure env vars are loaded
let transporter;
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
};

// Create a new inquiry (from contact page)
router.post('/', async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();

    // Send thank you email
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await getTransporter().sendMail({
          from: `"Twilight Studios" <${process.env.EMAIL_USER}>`,
          to: inquiry.email,
          subject: "Thank you for contacting Twilight Studios!",
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #000; text-transform: uppercase; letter-spacing: 2px;">Thank you, ${inquiry.name}!</h2>
              <p>We have successfully received your inquiry regarding <strong>"${inquiry.subject}"</strong>.</p>
              <p>Our team at Twilight Studios is currently reviewing your message and will get back to you shortly.</p>
              <br/>
              <p><strong>Your Message:</strong></p>
              <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #000; font-style: italic;">
                ${inquiry.message}
              </blockquote>
              <br/>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #999;">
                Twilight Studios<br/>
                This is an automated message.
              </p>
            </div>
          `
        });
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    res.status(201).json({ message: 'Inquiry received successfully', inquiry });
  } catch (error) {
    res.status(500).json({ error: 'Server error saving inquiry' });
  }
});

// Admin: Get all inquiries
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching inquiries' });
  }
});

// Admin: Update inquiry status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating inquiry' });
  }
});

// Admin: Add a follow-up note
router.post('/:id/followup', async (req, res) => {
  try {
    const { note } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    
    inquiry.followUps.push({ note, date: new Date() });
    await inquiry.save();
    
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: 'Server error adding follow-up' });
  }
});

// Admin: Delete inquiry
router.delete('/:id', async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting inquiry' });
  }
});

export default router;
