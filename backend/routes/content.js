import express from 'express';
import Content from '../models/Content.js';

const router = express.Router();

// GET all content sections
router.get('/', async (req, res) => {
  try {
    const contents = await Content.find();
    res.json(contents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET specific content section by name
router.get('/:section', async (req, res) => {
  try {
    const content = await Content.findOne({ section: req.params.section });
    if (!content) return res.status(404).json({ message: 'Content not found' });
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT (update) a content section or create if it doesn't exist
router.put('/:section', async (req, res) => {
  try {
    const content = await Content.findOneAndUpdate(
      { section: req.params.section },
      { ...req.body, section: req.params.section },
      { returnDocument: 'after', upsert: true }
    );
    res.json(content);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
