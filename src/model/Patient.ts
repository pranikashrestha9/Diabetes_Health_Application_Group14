import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  diabetesType: string;

  @Column()
  diagnosisDate: Date;

  @Column({ nullable: true })
  previousDiagnosis: string;

  @Column("float")
  heightCM: number;

  @Column("float")
  weightKG: number;

  @Column({
    type: "enum",
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // ✅ FIXED
  })
  bloodGroup: string;

  @Column()
  emergencyContactName: string;

  @Column()
  emergencyContactPhone: string;

  @Column({ nullable: true })
  currentMedication: string;

  @Column("float")
  targetGlucoseMin: number;

  @Column("float")
  targetGlucoseMax: number;

  @Column()
  activityLevel: string;

  @Column()
  dietaryPreference: string;

  @Column("text", { nullable: true })
  symptoms: string;

  @Column("text", { nullable: true })
  shortDescription: string;
}
