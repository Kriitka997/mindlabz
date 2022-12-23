import axios from "axios";
import apiUrl from "../config/constant";

async function getBooking(bodyData: any, signature: any) {

  const loginDetails = await axios.post(`${apiUrl.url}/getbookings`, bodyData, {
    headers: {
      "Content-Type": "application/json",
      "X-HAPI-Signature": signature
    }
  });
  const response = await loginDetails.data.hotelogix.response;
  return response;

  // if (response.status.message === "success") {
    // response.bookings.forEach((booking: any) => {
    //   return booking.roomStays;

    // });
  //   // console.log(response.bookings[0].rommStays,"responseresponseresponseresponse")
  //   // return {
  //   //   fName: response.bookings.guestStays.guestDetails.fName,
  //   //   lName: response.bookings.guestStays.guestDetails.lName,
  //   //   email: response.bookings.guestStays.guestDetails.email,
  //   //   reservationStatus: response.bookings.reservationStatus,
  //   //   roomId: response.bookingsroomId,
  //   //   roomName: response.bookingsroomName,
  //   // };
  // } else {
  //   return {
  //     status: response.status,
  //   };
  // }
}

export default getBooking;
