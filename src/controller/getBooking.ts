import axios from "axios";
import { Request, Response } from "express";
import apiUrl from "../config/constant";

async function getBooking(req: Request, res: Response) {
  const headerParams = {
    contentType: req.headers.contenttype,
    xHAPISign: req.headers.xhapisignature,
    page: req.headers.page,
    offset: req.headers.offset,
  };

  const bodyParams = req.body;
  const loginDetails = await axios.post(`${apiUrl.url}/getBookings`, req.body, {
    headers: {
      contentType: headerParams.contentType,
      xHAPISign: headerParams.xHAPISign,
      page: headerParams.page,
      offset: headerParams.offset,
    },
  });
  const response = await loginDetails.data.hotelogix.response;

  if (response.status.message === "Success") {
    return res.send({
      fName: response.bookings.guestStays.guestDetails.fName,
      lName: response.bookings.guestStays.guestDetails.lName,
      email: response.bookings.guestStays.guestDetails.email,
      reservationStatus: response.bookings.reservationStatus,
      roomId: response.bookingsroomId,
      roomName: response.bookingsroomName,
    });
  } else {
    return res.send({
      status: response.status,
    });
  }
}

export default getBooking;
