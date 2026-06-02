import { QueryRunner } from "typeorm";
import { AppDataSource } from "../config/orm.config";

export default class ORMHelper {
  static createQueryRunner = async (): Promise<QueryRunner> => {
    try {
      const queryRunner: QueryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      return queryRunner;
    } catch (error: any) {
      throw error;
    }
  };
  static createTransaction = async (runner: QueryRunner) => {
    try {
      await runner.startTransaction();

      return runner;
    } catch (error) {
      throw error;
    }
  };

  static commitTransaction = async (runner: QueryRunner) => {
    try {
      await runner.commitTransaction();
      await runner.release();
    } catch (error: any) {
      throw error;
    }
  };

  static rollBackTransaction = async (runner: QueryRunner) => {
    try {
      await runner.rollbackTransaction();
      await runner.release();
    } catch (error: any) {
      throw error;
    }
  };
  static release = async (runner: QueryRunner) => {
    try {
      await runner.release();
    } catch (error: any) {
      throw error;
    }
  };
}
