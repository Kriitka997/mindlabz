import express from "express";
import getBooking from "../controller/getBooking";

const route = express.Router();

import controllerIndex from "../controller/index";
// import helper from "../helper/index";
import middleware from "../middleware/index";


route.post("/token", controllerIndex.token.createToken);

route.get('/roomDetails', middleware.tokenVer.verifyToken,controllerIndex.roomDetails.detailsOfRoom)

// route.get(
//   "/wsAuth",
//   helper.wsAuth.getingWsAuthKeys
// );

// route.get(
//   "/getUsers",
//   controllerIndex.getUsers.getUsers
// );


// route.post("/login", helper.login);

// route.get("/getBooking", controllerIndex.getBooking);

export default route;
