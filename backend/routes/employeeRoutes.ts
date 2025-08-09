import express from 'express';
import { Employee } from '../models/Employee.js';
import { EmployeePosition } from '../models/EmployeePosition.js';
import { Department } from '../models/Department.js';
import { Position } from '../models/Position.js';

const router = express.Router();

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [{
        model: EmployeePosition,
        include: [Department, Position],
      }],
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [{
        model: EmployeePosition,
        include: [Department, Position],
      }],
    });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Create employee
router.post('/', async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create employee' });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const [updatedRowsCount] = await Employee.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    const updatedEmployee = await Employee.findByPk(req.params.id);
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const deletedRowsCount = await Employee.destroy({
      where: { id: req.params.id },
    });
    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

export default router;