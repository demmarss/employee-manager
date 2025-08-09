import { Table, Column, Model, DataType, HasMany, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { Department } from './Department.js';
import { Position } from './Position.js';

@Table({
  tableName: 'organizations',
  timestamps: true,
})
export class Organization extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  logo?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  address?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  descriptions?: string;

  @HasMany(() => Department)
  departments!: Department[];

  @HasMany(() => Position)
  positions!: Position[];
}