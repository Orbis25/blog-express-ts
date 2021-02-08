import dotenv from "dotenv";
import mongoose from "mongoose";

/**
 * load the env
 * @param path dir
 */
export const loadEnv = (path: String): void => {
  const env = process.env.NODE_ENV;
  switch (env) {
    case "development":
      dotenv.config({ path: path + `/.env.development` });
      break;
    case "production":
      dotenv.config({ path: path + `/.env.production` });
      break;
    default:
      dotenv.config({ path: path + `/.env.development` });
      break;
  }
};

/**
 * mongo connection
 */
export const createDbConnection = () => {
  const connection = process.env.DB_CONNECTION || "";
  mongoose.connect(
    connection,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) throw err;
      console.log("db conected");
    }
  );
};
