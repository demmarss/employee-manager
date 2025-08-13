import express from 'express';
import { Department, Organization, Position } from '../models/index.js';

const router = express.Router();

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [Organization, Position],
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// Get department by ID
router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id, {
      include: [Organization, Position],
    });
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department' });
  }
});

// Create department
router.post('/', async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create department' });
  }
});

// Update department
router.put('/:id', async (req, res) => {
  try {
    const [updatedRowsCount] = await Department.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    const updatedDepartment = await Department.findByPk(req.params.id);
    res.json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update department' });
  }
});

// Delete department
router.delete('/:id', async (req, res) => {
  try {
    const deletedRowsCount = await Department.destroy({
      where: { id: req.params.id },
    });
    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

export default router;