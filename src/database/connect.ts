import config from "../config/default";
import log from "../logger/logger";
import mongoose from "mongoose";

const connect = async () => {
  const dbUri = config.dbUri as string;

  try {
    await mongoose.connect(dbUri);
    log.info("connected database");
  } catch (error) {
    log.error("Could not connect to db");
    process.exit(1);
  }
};

export default connect;
