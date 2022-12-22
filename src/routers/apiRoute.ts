import express from "express";
import getBooking from "../controller/getBooking";

const route = express.Router();

import controllerIndex from "../controller/index";
import login from "../helper/login";
import middleware from "../middleware/index";

route.post("/token", controllerIndex.token.createToken);
route.get(
  "/getRoomDetails",
  middleware.tokenVer.verifyToken,
  controllerIndex.roomDetails.gettingRoomDetails
);
route.get(
  "/getCheckIn",
  middleware.tokenVer.verifyToken,
  controllerIndex.checkin.getCheckInDetails
);


route.post("/login", login);
route.post("/getBooking", getBooking);

export default route;
