import express from "express";
import bodyParser from "body-parser";

import { loadEnv, createDbConnection } from "./src/config/index";
import Routes from "./src/routes/index.routes";

const app = express();

//config
loadEnv(__dirname);
createDbConnection();
app.use(express.static(__dirname + "/public"));

//middlewares
app.use(bodyParser.json());

//routes
app.use(Routes);

//on
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`running in port ${PORT}`);
});
