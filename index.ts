import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { loadEnv, createDbConnection } from "./src/config/index";
import Routes from "./src/routes/index.routes";

const app = express();

//config
loadEnv(__dirname);
createDbConnection();
app.use(express.static(__dirname + "/public"));

//middlewares
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

//routes
app.use(Routes);
app.get("/", (req: Request, res: Response) => {
  return res.json({
    documentation_link: process.env.DOCUMENTATION_LINK,
  });
});

//on
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`running in port ${PORT}`);
});
