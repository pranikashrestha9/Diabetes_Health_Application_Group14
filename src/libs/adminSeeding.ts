import { DataSource } from "typeorm";
import { User } from "../model/BaseEntity";
import { hashPassword } from "../libs/passhash";

export const seedAdmin = async (dataSource: DataSource) => {
  try {
    const userRepo = dataSource.getRepository(User);

    const existingAdmin = await userRepo.findOne({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      return;
    }

    const hashedPassword = await hashPassword("Admin@123"); // 🔥 change in production

    const admin = userRepo.create({
      firstName: "Super",
      middleName: "Admin",
      lastName: "User",
      email: "admin@gmail.com",
      password: hashedPassword,
      mobileNumber: "9800000000",
      address: "Kathmandu",
      gender: "OTHER",
      dateOfBirth: new Date("2000-01-01"),
      role: "ADMIN",
    });

    await userRepo.save(admin);

    console.log("🔥 Admin seeded successfully");
    console.log("📧 Email: admin@gmail.com");
    console.log("🔑 Password: Admin@123");
  } catch (error) {
    console.error("❌ Admin seeding failed", error);
  }
};
