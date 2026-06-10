import express from 'express';
import HeroSlide from '../models/HeroSlide.js';

const router = express.Router();

// Get all slides
router.get('/', async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add slide
router.post('/', async (req, res) => {
  const slide = new HeroSlide(req.body);
  try {
    const newSlide = await slide.save();
    res.status(201).json(newSlide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update slide
router.put('/:id', async (req, res) => {
  try {
    const updatedSlide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(updatedSlide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete slide
router.delete('/:id', async (req, res) => {
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slide deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
