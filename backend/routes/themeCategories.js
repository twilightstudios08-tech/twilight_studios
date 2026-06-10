import express from 'express';
import ThemeCategory from '../models/ThemeCategory.js';

const router = express.Router();

// Get all theme categories
router.get('/', async (req, res) => {
  try {
    const categories = await ThemeCategory.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new theme category
router.post('/', async (req, res) => {
  const category = new ThemeCategory({
    name: req.body.name,
    coverImage: req.body.coverImage
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a theme category
router.put('/:id', async (req, res) => {
  try {
    const category = await ThemeCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (req.body.name) category.name = req.body.name;
    if (req.body.coverImage) category.coverImage = req.body.coverImage;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a theme category
router.delete('/:id', async (req, res) => {
  try {
    const category = await ThemeCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    await category.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
