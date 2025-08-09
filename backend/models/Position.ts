import { Table, Column, Model, DataType, BelongsTo, ForeignKey, HasMany, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { Department } from './Department.js';
import { Organization } from './Organization.js';
import { EmployeePosition } from './EmployeePosition.js';

@Table({
  tableName: 'positions',
  timestamps: true,
})
export class Position extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  departmentId!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  organizationId!: number;

  @ForeignKey(() => Position)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parentPositionId?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  hierarchyLevel!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  hierarchyPath?: string;
  @BelongsTo(() => Department)
  department!: Department;

  @BelongsTo(() => Organization)
  organization!: Organization;

  @BelongsTo(() => Position, { foreignKey: 'parentPositionId', as: 'parentPosition' })
  parentPosition?: Position;

  @HasMany(() => Position, { foreignKey: 'parentPositionId', as: 'childPositions' })
  childPositions?: Position[];
  @HasMany(() => EmployeePosition)
  employeePositions!: EmployeePosition[];
}