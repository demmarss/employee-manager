import express from 'express';
import { DatabaseSeeder } from '../seeders/index.js';

const router = express.Router();

// Run database seeders
router.post('/run', async (req, res) => {
  try {
    const seeder = new DatabaseSeeder();
    const result = await seeder.run();
    
    res.json({
      success: true,
      message: 'Database seeded successfully!',
      data: result
    });
  } catch (error) {
    console.error('Seeder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get seeder status/info
router.get('/status', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Seeder endpoint is available',
      endpoints: {
        run: 'POST /api/seeders/run - Run database seeders',
        status: 'GET /api/seeders/status - Get seeder status'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get seeder status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;