import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DoctorPayout } from "./Payout";
import { Payment } from "./Payment";

@Entity('payout_items')
export class PayoutItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DoctorPayout, (payout) => payout.items, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "payout_id" })
  payout: DoctorPayout;

  @ManyToOne(() => Payment, { eager: true })
  @JoinColumn({ name: "payment_id" })
  payment: Payment;

  @Column("decimal", { precision: 10, scale: 2 })
  doctorEarning: number;
}