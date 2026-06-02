import {
  Entity, PrimaryGeneratedColumn,
  OneToOne, JoinColumn
} from "typeorm";
import { User } from "./BaseEntity";

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}