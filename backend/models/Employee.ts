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
  address?: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  roles?: string[];

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dateOfBirth?: Date;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  phoneNumber?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  photoUrl?: string;

  @HasMany(() => EmployeePosition)
  employeePositions!: EmployeePosition[];
}