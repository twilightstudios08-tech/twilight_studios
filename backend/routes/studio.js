import express from 'express';
import Studio from '../models/Studio.js';

const router = express.Router();

// GET /api/studio
router.get('/', async (req, res) => {
  try {
    let studio = await Studio.findOne();
    if (!studio) {
      // Create a default one if it doesn't exist
      studio = await Studio.create({});
    }
    res.json(studio);
  } catch (err) {
    console.error('Error fetching studio details:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/studio
router.put('/', async (req, res) => {
  try {
    let studio = await Studio.findOne();
    if (!studio) {
      studio = new Studio();
    }
    
    const {
      name,
      description,
      heroImageDesktop,
      heroImageMobile,
      threeSixtyImage,
      mapEmbedUrl,
      images,
      videos
    } = req.body;

    if (name !== undefined) studio.name = name;
    if (description !== undefined) studio.description = description;
    if (heroImageDesktop !== undefined) studio.heroImageDesktop = heroImageDesktop;
    if (heroImageMobile !== undefined) studio.heroImageMobile = heroImageMobile;
    if (threeSixtyImage !== undefined) studio.threeSixtyImage = threeSixtyImage;
    if (mapEmbedUrl !== undefined) studio.mapEmbedUrl = mapEmbedUrl;
    if (images !== undefined) studio.images = images;
    if (videos !== undefined) studio.videos = videos;

    await studio.save();
    res.json(studio);
  } catch (err) {
    console.error('Error updating studio details:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
