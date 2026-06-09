import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  
} from "typeorm";
import { RefreshToken } from "./Refresh";
import { Patient } from "./Patient";
import { Doctor } from "./Doctor";
import { Admin } from "./Admin";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  firstName: string;

  @Column()
  middleName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({
   select: true,
  })
  password: string;

  @Column()
  mobileNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: "enum",
    enum: ["MALE", "FEMALE", "OTHER"],
    default: "OTHER",
  })
  gender: string;

  @Column()
  dateOfBirth: Date;

  @Column({ nullable: true })
  profileImageURL: string;

  @Column({
    type: "enum",
    enum: ["ACTIVE", "INACTIVE", "BLOCKED"],
    default: "ACTIVE",
  })
  isActive: string;

  @Column({
    type: "enum",
    enum: ["ADMIN", "PATIENT", "DOCTOR", "CONTENT_MANAGER"],
    default: "PATIENT",
  })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @OneToOne(() => Patient, (patient) => patient.user)
  patient: Patient;

  @OneToOne(() => Doctor, (doctor) => doctor.user)
  doctor: Doctor;

  @OneToOne(() => Admin, (admin) => admin.user)
  admin: Admin;
}
