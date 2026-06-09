import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./BaseEntity";
import { Doctor } from "./Doctor";

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  // 👤 Patient (User with role PATIENT)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "patientId" })
  patient: User;

  // 👨‍⚕️ Doctor
  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: "doctorId" })
  doctor: Doctor;

  @Column({ type: "date" })
  bookingDate: string;

  @Column()
  startTime: string; // "10:00"

  @Column()
  endTime: string; // "10:30"

  @Column({ nullable: true })
  meetLink: string;

  @Column({
    type: "enum",
    enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
    default: "PENDING",
  })
  status: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
