import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./BaseEntity";

export enum BlogStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum BlogCategory {
  DIABETES_MANAGEMENT = "DIABETES_MANAGEMENT",
  NUTRITION_DIET = "NUTRITION_DIET",
  EXERCISE_FITNESS = "EXERCISE_FITNESS",
  MEDICATION_ADHERENCE = "MEDICATION_ADHERENCE",
  MENTAL_HEALTH = "MENTAL_HEALTH",
  LIFESTYLE_CHANGES = "LIFESTYLE_CHANGES",
  PATIENT_EDUCATION = "PATIENT_EDUCATION",
  PREVENTION_AWARENESS = "PREVENTION_AWARENESS",
  COMPLICATIONS = "COMPLICATIONS",
  RURAL_HEALTHCARE = "RURAL_HEALTHCARE",
  CHILD_YOUNG_HEALTH = "CHILD_YOUNG_HEALTH",
  GENERAL_HEALTH = "GENERAL_HEALTH",
}

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  blogId: number;

  // 📝 Title
  @Column("varchar", { length: 255 })
  title: string;

  // 🔗 Slug (SEO friendly URL)
  @Column({ unique: true })
  slug: string;

  // 📄 Short summary (for cards)
  @Column("text")
  summary: string;

  // 🧾 Main content (HTML or Markdown)
  @Column("text")
  content: string;

  // 🖼️ Cover Image
  @Column({ nullable: true })
  coverImage: string;

  // 🏷️ Tags (JSON array)
  @Column("json", { nullable: true })
  tags: string[];

  // 📂 Category
  @Column({
    type: "enum",
    enum: BlogCategory,
    nullable: true,
  })
  category: BlogCategory;

  // 📊 Status control
  @Column({
    type: "enum",
    enum: BlogStatus,
    default: BlogStatus.DRAFT,
  })
  status: BlogStatus;

  // 👤 Author (Internal Manager / Admin)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "authorId" })
  author: User;

  // 🗓️ Publish date
  @Column({ nullable: true })
  publishedAt: Date;

  // ⏱️ Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
