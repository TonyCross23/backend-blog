import { PrismaClient } from "@prisma/client";
import logger from "../config/loggers";

export const prisma = new PrismaClient();

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info("Database connected");
  } catch (error) {
    logger.error("Database connection failed:", error);
    process.exit(1);
  }
};
