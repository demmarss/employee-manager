import express from 'express';
import { EmployeePosition, Department, Position, Employee } from '../models/index.js';

const router = express.Router();

// Get all employee positions
router.get('/', async (req, res) => {
  try {
    const employeePositions = await EmployeePosition.findAll({
      include: [Department, Position, Employee],
    });
    res.json(employeePositions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee positions' });
  }
});

// Get employee position by ID
router.get('/:id', async (req, res) => {
  try {
    const employeePosition = await EmployeePosition.findByPk(req.params.id, {
      include: [Department, Position, Employee],
    });
    if (!employeePosition) {
      return res.status(404).json({ error: 'Employee position not found' });
    }
    res.json(employeePosition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee position' });
  }
});

// Create employee position
router.post('/', async (req, res) => {
  try {
    const employeePosition = await EmployeePosition.create(req.body);
    res.status(201).json(employeePosition);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create employee position' });
  }
});

// Update employee position
router.put('/:id', async (req, res) => {
  try {
    const [updatedRowsCount] = await EmployeePosition.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Employee position not found' });
    }
    const updatedEmployeePosition = await EmployeePosition.findByPk(req.params.id);
    res.json(updatedEmployeePosition);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update employee position' });
  }
});

// Delete employee position
router.delete('/:id', async (req, res) => {
  try {
    const deletedRowsCount = await EmployeePosition.destroy({
      where: { id: req.params.id },
    });
    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: 'Employee position not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee position' });
  }
});

export default router;