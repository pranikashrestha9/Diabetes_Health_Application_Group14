import {
  Entity, PrimaryGeneratedColumn,
  OneToOne, JoinColumn
} from "typeorm";
import { User } from "./BaseEntity";

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

 @OneToOne(() => User, (user) => user.admin, {
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;


}