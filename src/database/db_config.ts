import { Sequelize } from "sequelize";
import settings from "../settings";

const options =
  settings.MODE == "development"
    ? null
    : {
        dialectOptions: {
          ssl: { require: true, rejectUnauthorized: false },
        },
      };

const db = new Sequelize(
  settings.MODE === "development"
    ? settings.DEVELOPMENT_SERVER.DATABASE
    : settings.PRODUCTION_SERVER.DATABASE,
  settings.MODE === "development"
    ? settings.DEVELOPMENT_SERVER.USER
    : settings.PRODUCTION_SERVER.USER,
  settings.MODE === "development"
    ? settings.DEVELOPMENT_SERVER.PASSWORD
    : settings.PRODUCTION_SERVER.PASSWORD,
  {
    host:
      settings.MODE === "development"
        ? settings.DEVELOPMENT_SERVER.HOST
        : settings.PRODUCTION_SERVER.HOST,
    dialect: "postgres",
    port:
      settings.MODE === "development"
        ? settings.DEVELOPMENT_SERVER.PORT
        : settings.PRODUCTION_SERVER.PORT,
    ...options,
  }
);

export default db;
