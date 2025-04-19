import express from "express";
import config from "config";
import logger from "./utils/logger";
import connect from "./utils/connect";
import routers from "./routes/router";
import deserializeUser from "./middlewares/deserializeUser";

const port = config.get<number>("port");
const host = config.get<string>("host");

const app = express();
app.use(express.json());
app.use(deserializeUser);

app.listen(port, async () => {
  logger.info(`server is running on http://${host}:${port}`);
  await connect();

  routers(app);
});
