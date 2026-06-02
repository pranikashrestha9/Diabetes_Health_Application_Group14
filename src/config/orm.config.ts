import { DataSource } from "typeorm";
import { environment } from "./env.config";

export const AppDataSource: DataSource = new DataSource({
  type: "mysql",
  host: environment.DB_HOST,
  port: environment.DB_PORT,
  username: environment.DB_USERNAME,
  password: environment.DB_PASSWORD,
  database: environment.DB_NAME,
  synchronize: true,
  logging: false,
  dropSchema: false,
  entities: ["src/model/**/*.ts"],
});

export const initializeDataSource = async () => {
  try {
    (await AppDataSource.initialize()).runMigrations();
    //await seedAdmin(AppDataSource);
    console.log(`Datasource initialized successfully`);
  } catch (error) {
    console.log("Unable to connect datasource", error);
    throw error;
  }
};
