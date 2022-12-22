import bodyParser from "body-parser";
import express from "express";
import routes from "../routers/apiRoute";

const app = express();

app.use(express.json());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", routes);

export default app;