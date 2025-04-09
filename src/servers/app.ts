import express from "express";
import router from "../routes/root";
import { connectDatabase } from "../databases/db";
import { HOST, PORT } from "./configs";
import logger from "../config/loggers";

const app = express();

// Connect to database
connectDatabase();

// JSON middleware
app.use(express.json());

// Routes
app.use("/api", router);

app.listen(PORT, () => {
  logger.info(`Server is running on http://${HOST}:${PORT}`);
});

export default app;
