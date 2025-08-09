import { Table, Column, Model, DataType, BelongsTo, ForeignKey, HasMany, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { Organization } from './Organization.js';
import { Position } from './Position.js';
import { EmployeePosition } from './EmployeePosition.js';

@Table({
  tableName: 'departments',
  timestamps: true,
})
export class Department extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string;

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  organizationId!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  code?: string;

  @BelongsTo(() => Organization)
  organization!: Organization;

  @HasMany(() => Position)
  positions!: Position[];

  @HasMany(() => EmployeePosition)
  employeePositions!: EmployeePosition[];
}