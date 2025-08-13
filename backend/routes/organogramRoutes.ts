import express from 'express';
import { Position, Department, Organization, Employee, EmployeePosition } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Get organogram for an organization
router.get('/organization/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;
    
    const positions = await Position.findAll({
      where: { organizationId },
      include: [
        {
          model: Department,
          attributes: ['id', 'name', 'code']
        },
        {
          model: Position,
          as: 'parentPosition',
          attributes: ['id', 'title', 'hierarchyLevel']
        },
        {
          model: Position,
          as: 'childPositions',
          attributes: ['id', 'title', 'hierarchyLevel']
        },
        {
          model: EmployeePosition,
          include: [{
            model: Employee,
            attributes: ['id', 'name', 'photoUrl']
          }],
          where: {
            endDate: { [Op.is]: null }
          },
          required: false
        }
      ],
      order: [['hierarchyLevel', 'ASC'], ['title', 'ASC']]
    });

    const organogram = buildOrganogramTree(positions);
    res.json(organogram);
  } catch (error) {
    console.error('Error fetching organogram:', error);
    res.status(500).json({ error: 'Failed to fetch organogram' });
  }
});

// Get organogram for a department
router.get('/department/:departmentId', async (req, res) => {
  try {
    const { departmentId } = req.params;
    
    const positions = await Position.findAll({
      where: { departmentId },
      include: [
        {
          model: Department,
          attributes: ['id', 'name', 'code']
        },
        {
          model: Position,
          as: 'parentPosition',
          attributes: ['id', 'title', 'hierarchyLevel']
        },
        {
          model: Position,
          as: 'childPositions',
          attributes: ['id', 'title', 'hierarchyLevel']
        },
        {
          model: EmployeePosition,
          include: [{
            model: Employee,
            attributes: ['id', 'name', 'photoUrl']
          }],
          where: {
            endDate: { [Op.is]: null }
          },
          required: false
        }
      ],
      order: [['hierarchyLevel', 'ASC'], ['title', 'ASC']]
    });

    const organogram = buildOrganogramTree(positions);
    res.json(organogram);
  } catch (error) {
    console.error('Error fetching department organogram:', error);
    res.status(500).json({ error: 'Failed to fetch department organogram' });
  }
});

// Update position hierarchy
router.put('/position/:positionId/hierarchy', async (req, res) => {
  try {
    const { positionId } = req.params;
    const { parentPositionId, hierarchyLevel } = req.body;

    const position = await Position.findByPk(positionId);
    if (!position) {
      return res.status(404).json({ error: 'Position not found' });
    }

    // Update hierarchy information
    await position.update({
      parentPositionId: parentPositionId || null,
      hierarchyLevel: hierarchyLevel || 1
    });

    // Update hierarchy path
    await updateHierarchyPath(position);

    // Update child positions if hierarchy changed
    await updateChildPositionsHierarchy(position);

    const updatedPosition = await Position.findByPk(positionId, {
      include: [
        { model: Position, as: 'parentPosition' },
        { model: Position, as: 'childPositions' }
      ]
    });

    res.json(updatedPosition);
  } catch (error) {
    console.error('Error updating position hierarchy:', error);
    res.status(500).json({ error: 'Failed to update position hierarchy' });
  }
});

// Get position hierarchy path
router.get('/position/:positionId/hierarchy-path', async (req, res) => {
  try {
    const { positionId } = req.params;
    const hierarchyPath = await getPositionHierarchyPath(parseInt(positionId));
    res.json({ hierarchyPath });
  } catch (error) {
    console.error('Error fetching hierarchy path:', error);
    res.status(500).json({ error: 'Failed to fetch hierarchy path' });
  }
});

// Helper function to build organogram tree structure
function buildOrganogramTree(positions: any[]): any[] {
  const positionMap = new Map();
  const rootPositions: any[] = [];

  // Create a map of all positions
  positions.forEach(position => {
    positionMap.set(position.id, {
      ...position.toJSON(),
      children: []
    });
  });

  // Build the tree structure
  positions.forEach(position => {
    const positionData = positionMap.get(position.id);
    
    if (position.parentPositionId) {
      const parent = positionMap.get(position.parentPositionId);
      if (parent) {
        parent.children.push(positionData);
      } else {
        rootPositions.push(positionData);
      }
    } else {
      rootPositions.push(positionData);
    }
  });

  return rootPositions;
}

// Helper function to update hierarchy path
async function updateHierarchyPath(position: any): Promise<void> {
  let path = position.title;
  let currentPosition = position;

  while (currentPosition.parentPositionId) {
    const parent = await Position.findByPk(currentPosition.parentPositionId);
    if (parent) {
      path = `${parent.title} > ${path}`;
      currentPosition = parent;
    } else {
      break;
    }
  }

  await position.update({ hierarchyPath: path });
}

// Helper function to update child positions hierarchy
async function updateChildPositionsHierarchy(parentPosition: any): Promise<void> {
  const childPositions = await Position.findAll({
    where: { parentPositionId: parentPosition.id }
  });

  for (const child of childPositions) {
    await child.update({
      hierarchyLevel: parentPosition.hierarchyLevel + 1
    });
    await updateHierarchyPath(child);
    await updateChildPositionsHierarchy(child);
  }
}

// Helper function to get position hierarchy path
async function getPositionHierarchyPath(positionId: number): Promise<string[]> {
  const path: string[] = [];
  let currentPositionId: number | null = positionId;

  while (currentPositionId) {
    const position = await Position.findByPk(currentPositionId, {
      attributes: ['id', 'title', 'parentPositionId']
    });

    if (position) {
      path.unshift(position.title);
      currentPositionId = position.parentPositionId;
    } else {
      break;
    }
  }

  return path;
}

export default router;