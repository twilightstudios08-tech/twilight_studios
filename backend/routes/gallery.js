import express from 'express';
import Gallery from '../models/Gallery.js';

const router = express.Router();

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add image
router.post('/', async (req, res) => {
  const image = new Gallery(req.body);
  try {
    const newImage = await image.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete image
router.delete('/:id', async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Update image
router.put('/:id', async (req, res) => {
  try {
    const updatedImage = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );
    res.json(updatedImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
