import axios from "axios";
import apiUrl from "../config/constant";
const LocalStorage = require("node-localstorage").LocalStorage,
  localStorage = new LocalStorage("./data");

import getBooking from "../controller/getBooking";
import hotelogixSignature from "./hotelogixSignature";

export default {
  login: async (reqBody: any, signature: any) => {

    const loginDetails = await axios.post(`${apiUrl.url}/login`, reqBody, {
      headers: {
        "Content-Type": "application/json",
        "X-HAPI-Signature": signature
      }
    });
    const loginResponse = await loginDetails.data.hotelogix.response;
    return loginResponse;

    // if (loginResponse.status.message === "success") {
    //   const accessData = {
    //     accesskey: loginResponse.accesskey,
    //     accesssecret: loginResponse.accesssecret
    //   }

    //   const bookingData = {
    //     "hotelogix": {
    //       "version": "1.0",
    //       "datetime": "2022-12-23T15:55:00+05:30",
    //       "request": {
    //         "method": "getbookings",
    //         "key": accessData.accesskey,
    //         "data": {
    //           "fromDate": "2020-10-13",
    //           "toDate": "2020-10-13",
    //           "searchBy": "STAYDATE",
    //           "reservationStatus": [
    //             "CHECKIN"
    //           ],
    //           "extraDetails": {
    //             "Purpose": true,
    //             "SalesPerson": true,
    //             "CustomTag": true,
    //             "CustomFields": true
    //           }
    //         }
    //       }
    //     }
    //   };
    //   const signatureForBooking = await hotelogixSignature.createSignature(bookingData, accessData.accesssecret);

    //   if (signatureForBooking.length != 0) {

    //     getBooking(bookingData, signatureForBooking);
    //   }
    // } else {
    //   return {
    //     status: loginResponse,
    //   };
    // }
  }
}