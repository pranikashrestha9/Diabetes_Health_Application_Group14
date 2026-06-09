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
export class Recommendation {
  @PrimaryGeneratedColumn()
  recommendationId: number;

  @ManyToOne(() => Booking, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "bookingId" })
  booking: Booking;

  @Column("text")
  advice: string;

  @Column("json", { nullable: true })
dietPlan: {
  breakfast?: string[];
  lunch?: string[];
  dinner?: string[];
  snacks?: string[];
  avoidFoods?: string[];
};

  @Column("text", { nullable: true })
  lifestyleChanges: string;

  @CreateDateColumn()
  createdAt: Date;
}
