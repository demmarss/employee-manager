import express from 'express';
import { Position, Department, Organization } from '../models/index.js';

const router = express.Router();

// Get all positions
router.get('/', async (req, res) => {
  try {
    const positions = await Position.findAll({
      include: [Department, Organization],
    });
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

// Get position by ID
router.get('/:id', async (req, res) => {
  try {
    const position = await Position.findByPk(req.params.id, {
      include: [Department, Organization],
    });
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }
    res.json(position);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch position' });
  }
});

// Create position
router.post('/', async (req, res) => {
  try {
    const position = await Position.create(req.body);
    res.status(201).json(position);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create position' });
  }
});

// Update position
router.put('/:id', async (req, res) => {
  try {
    const [updatedRowsCount] = await Position.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Position not found' });
    }
    const updatedPosition = await Position.findByPk(req.params.id);
    res.json(updatedPosition);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update position' });
  }
});

// Delete position
router.delete('/:id', async (req, res) => {
  try {
    const deletedRowsCount = await Position.destroy({
      where: { id: req.params.id },
    });
    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: 'Position not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete position' });
  }
});

export default router;