import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DoctorPayout } from "./Payout";
import { Payment } from "./Payment";

@Entity('payout_items')
export class PayoutItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DoctorPayout, (payout) => payout.items, {
    onDelete: "CASCADE",
  })
  payout: DoctorPayout;

  @ManyToOne(() => Payment, { eager: true })
  payment: Payment;

  @Column("decimal", { precision: 10, scale: 2 })
  doctorEarning: number;
}