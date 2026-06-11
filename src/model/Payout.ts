import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Doctor } from "./Doctor";
import { PayoutItem } from "./payoutItem";

@Entity("doctor_payouts")
export class DoctorPayout {
  @PrimaryGeneratedColumn()
  payoutId: number;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: "doctorId" })
  doctor: Doctor;

  @Column("decimal", { precision: 10, scale: 2 })
  totalAmount: number; // total paid to doctor

  @Column({ default: "PENDING" })
  status: "PENDING" | "PAID" | "FAILED";

  @Column({ type: "timestamp", nullable: true })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PayoutItem, (item) => item.payout)
  items: PayoutItem[];
}
