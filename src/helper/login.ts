import axios from "axios";
import apiUrl from "../config/constant";

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

  }
}