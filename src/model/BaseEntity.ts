import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from "typeorm";
import { RefreshToken } from "./Refresh";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  middleName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
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
}
