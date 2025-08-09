import express from 'express';
import { Organization } from '../models/Organization.js';
import { Department } from '../models/Department.js';
import { Position } from '../models/Position.js';

const router = express.Router();

// Get all organizations
router.get('/', async (req, res) => {
  try {
    const organizations = await Organization.findAll({
      include: [Department, Position],
    });
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

// Get organization by ID
router.get('/:id', async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id, {
      include: [Department, Position],
    });
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.json(organization);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

// Create organization
router.post('/', async (req, res) => {
  try {
    const organization = await Organization.create(req.body);
    res.status(201).json(organization);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create organization' });
  }
});

// Update organization
router.put('/:id', async (req, res) => {
  try {
    const [updatedRowsCount] = await Organization.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    const updatedOrganization = await Organization.findByPk(req.params.id);
    res.json(updatedOrganization);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update organization' });
  }
});

// Delete organization
router.delete('/:id', async (req, res) => {
  try {
    const deletedRowsCount = await Organization.destroy({
      where: { id: req.params.id },
    });
    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete organization' });
  }
});

export default router;