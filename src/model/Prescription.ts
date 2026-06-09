import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Booking } from "./Booking";

@Entity()
export class Prescription {
  @PrimaryGeneratedColumn()
  prescriptionId: number;

  @ManyToOne(() => Booking, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "bookingId" })
  booking: Booking;

@Column("json")
medicines: {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
}[]; // JSON string or structured later

  @Column("text", { nullable: true })
  dosageInstructions: string;

  @Column("text", { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
