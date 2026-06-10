import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

// Get settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching settings' });
  }
});

// Update blocked weekdays
router.put('/blocked-weekdays', async (req, res) => {
  try {
    const { blockedWeekdays } = req.body;
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({ blockedWeekdays });
    } else {
      settings.blockedWeekdays = blockedWeekdays;
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating blocked weekdays' });
  }
});

// Update analytics IDs
router.put('/analytics', async (req, res) => {
  try {
    const { metaPixelId, googleAnalyticsId } = req.body;
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({ metaPixelId, googleAnalyticsId });
    } else {
      if (metaPixelId !== undefined) settings.metaPixelId = metaPixelId;
      if (googleAnalyticsId !== undefined) settings.googleAnalyticsId = googleAnalyticsId;
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating analytics settings' });
  }
});

// Update contact details
router.put('/contact', async (req, res) => {
  try {
    const { contactEmail, whatsappNumber } = req.body;
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({ contactEmail, whatsappNumber });
    } else {
      if (contactEmail !== undefined) settings.contactEmail = contactEmail;
      if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber;
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating contact settings' });
  }
});

export default router;
