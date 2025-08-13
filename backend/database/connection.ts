import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { Organization, Department, Position, Employee, EmployeePosition } from '../models/index.js';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'employee_manager',
  models: [Organization, Department, Position, Employee, EmployeePosition],
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});