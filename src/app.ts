import { initializeDataSource } from "./config/orm.config";
import express, { Express } from "express";
import { initializeExpressServer } from "./config/server.config";

(function main() {
  initializeDataSource();
  const app: Express = express();
  initializeExpressServer(app);
})();
