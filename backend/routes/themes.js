import express from 'express';
import Theme from '../models/Theme.js';

const router = express.Router();

// Get all themes
router.get('/', async (req, res) => {
  try {
    const themes = await Theme.find();
    res.json(themes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create theme
router.post('/', async (req, res) => {
  const theme = new Theme(req.body);
  try {
    const newTheme = await theme.save();
    res.status(201).json(newTheme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update theme
router.put('/:id', async (req, res) => {
  try {
    const updatedTheme = await Theme.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(updatedTheme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete theme
router.delete('/:id', async (req, res) => {
  try {
    await Theme.findByIdAndDelete(req.params.id);
    res.json({ message: 'Theme deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
