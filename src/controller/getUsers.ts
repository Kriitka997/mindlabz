import apiUrl from "../config/constant";
import axios from "axios";
import loginFunction from "../helper/login";
import hotelogixSignature from "../helper/hotelogixSignature";

export default {
    getUsers: async (reqBodyData:any, signature:any) => {

        const consumerKey = "13E1DD90BF875A42B4CCED372344411A0A902520";
        const consumerSecret = "076C70B9A1C4072EAC9091D46A6C502AD9D97DF7"


        const getUsersDetails = await axios.post(`${apiUrl.url}/getusers`, reqBodyData, {
            headers: {
                "Content-Type": "application/json",
                "X-HAPI-Signature": signature
            }
        }
        );
        const result = getUsersDetails.data.hotelogix.response;
        return result;
    }
}