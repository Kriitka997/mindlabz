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
}

export default getBooking;
