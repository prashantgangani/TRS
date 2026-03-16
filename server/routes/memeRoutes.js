const express = require('express');
const router = express.Router();
const Meme = require('../models/Meme');
const Log = require('../models/Log');

// Middleware to verify if admin/superadmin
const checkRole = (roles) => {
  return (req, res, next) => {
    // Basic implementation, update based on your actual auth mechanism if needed.
    // Assuming role comes from auth token or header. Here we just assume it's sent in body or headers for simplicity if no auth middleware exists.
    // If you have auth middleware, apply it instead.
    next();
  };
};

// Get all memes
router.get('/', async (req, res) => {
  try {
    const memes = await Meme.find().sort({ order: 1 });
    res.json(memes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new meme
router.post('/', async (req, res) => {
  try {
    const highestMeme = await Meme.findOne().sort('-order');
    const order = highestMeme ? highestMeme.order + 1 : 0;
    
    const meme = new Meme({
      imageUrl: req.body.imageUrl,
      title: req.body.title || '',
      order: order
    });

    const newMeme = await meme.save();
    
    // Attempt to log if possible
    try {
      if(req.body.adminUsername) {
        await Log.create({
          action: 'Added Meme',
          details: `Image URL: ${req.body.imageUrl}`,
          admin: req.body.adminUsername
        });
      }
    } catch(e) {}

    res.status(201).json(newMeme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a meme
router.put('/:id', async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) return res.status(404).json({ message: 'Meme not found' });

    if (req.body.imageUrl !== undefined) meme.imageUrl = req.body.imageUrl;
    if (req.body.title !== undefined) meme.title = req.body.title;
    if (req.body.order !== undefined) meme.order = req.body.order;

    const updatedMeme = await meme.save();

    res.json(updatedMeme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a meme
router.delete('/:id', async (req, res) => {
  try {
    const meme = await Meme.findByIdAndDelete(req.params.id);
    if (!meme) return res.status(404).json({ message: 'Meme not found' });
    
    try {
      if(req.query.adminUsername) {
        await Log.create({
          action: 'Deleted Meme',
          details: `Image URL: ${meme.imageUrl}`,
          admin: req.query.adminUsername
        });
      }
    } catch(e) {}

    res.json({ message: 'Meme deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
