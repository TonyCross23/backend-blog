import config from "config";
import log from "../../logger/logger";
import mongoose from "mongoose";

const connect = async () => {
  const dbUri = config.get("dbUri") as string;

  try {
    await mongoose.connect(dbUri);
    log.info("connected database");
  } catch (error) {
    log.error("Could not connect to db");
    process.exit(1);
  }
};

export default connect;
