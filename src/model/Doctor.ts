import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToOne, JoinColumn
} from "typeorm";
import { User } from "./BaseEntity";

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  licenseNumber: string;

  @Column()
  qualification: string;

  @Column()
  specialization: string;

  @Column()
  yearsOfExperience: number;

  @Column("text")
  biography: string;

  @Column("float")
  consultationFee: number;

  @Column()
  availableFrom: string;

  @Column()
  availableTo: string;

  @Column({ default: 0 })
  averageRating: number;
}