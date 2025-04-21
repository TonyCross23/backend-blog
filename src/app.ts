import express from "express";
import log from "../logger/logger";
import config from "config";
import connect from "./database/connect";
import route from "./route";
import deserializeUser from "./middlewares/deserializeUser";

const port = config.get("port") as string;
const host = config.get("host") as string;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(deserializeUser);

app.listen(port, async () => {
  log.info(`Server is running on http://${host}:${port}`);
  await connect();

  route(app);
});
