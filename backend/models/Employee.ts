import { Table, Column, Model, DataType, HasMany, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { EmployeePosition } from './EmployeePosition.js';

@Table({
  tableName: 'employees',
  timestamps: true,
})
export class Employee extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare address?: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare roles?: string[];

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare dateOfBirth?: Date;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare phoneNumber?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare photoUrl?: string;

  @HasMany(() => EmployeePosition)
  declare employeePositions: EmployeePosition[];
}