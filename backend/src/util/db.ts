import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { dbLogger, serverLogger } from "../util/logger";
import { envType } from "./envConfig";
import env from "../util/validateEnv";
import path from "path";

export const connectDB = async (): Promise<Sequelize> => {
  try {
    const sequelizeConfig: SequelizeOptions = {
      models: [path.join(__dirname, "../models/*.model.{ts,js}")],
      dialect: "postgres",
      host: env.POSTGRES_HOST,
      port: parseInt(env.POSTGRES_PORT),
      database: env.POSTGRES_DB,
      username: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      logging: (sql) => {
        dbLogger.debug(sql); // Log SQL queries to the database log file
      },
    };

    // Conditionally add `dialectOptions` for staging and production
    if (envType === "staging" || envType === "production") {
      sequelizeConfig.dialectOptions = {
        ssl: {
          require: true, // Use SSL in staging and production
          rejectUnauthorized: false, // Allow self-signed certificates
        },
      };
    }

    // Connect to Postgres
    const sequelize = new Sequelize(sequelizeConfig);

    // Test DB Connection
    await sequelize.authenticate();

    // Sync models with database
    await sequelize.sync({ alter: true });

    serverLogger.info("Database connection established.");

    return sequelize;
  } catch (error) {
    serverLogger.error("Database connection error:" + (error as Error).stack);
    process.exit(1);
  }
};
