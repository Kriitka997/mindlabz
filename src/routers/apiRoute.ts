import express from "express";

const route = express.Router();

import controllerIndex from "../controller/index";
import middleware from "../middleware/index";
import helper from "../helper/index"

route.post("/token", controllerIndex.token.createToken);
route.get("/wsAuth", middleware.tokenVer.verifyToken, helper.wsAuth.gettingDetails);
route.get("/getUsers", controllerIndex.getUser.getUsers);


export default route;
