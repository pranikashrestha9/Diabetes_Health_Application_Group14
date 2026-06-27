import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.doctor, {
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
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

  @Column({
    type: "simple-array",
  })
  availableDays: string[];
}
