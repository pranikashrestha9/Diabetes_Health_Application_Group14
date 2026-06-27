import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class InternalManager {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.internalManager, {
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;
}
