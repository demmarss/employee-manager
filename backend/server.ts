import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { sequelize } from './database/connection.js';
import organizationRoutes from './routes/organizationRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import positionRoutes from './routes/positionRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import employeePositionRoutes from './routes/employeePositionRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import organogramRoutes from './routes/organogramRoutes.js';
import seederRoutes from './routes/seederRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/organizations', organizationRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/employee-positions', employeePositionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/organogram', organogramRoutes);
app.use('/api/seeders', seederRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();