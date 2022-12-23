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

        // if (result.status.message == "success") {
        //     const loginBodyData = {
        //         "hotelogix": {
        //             "version": "1.0",
        //             "datetime": "2022-12-23T15:55:00+05:30",
        //             "request": {
        //                 "method": "login",
        //                 "key": consumerKey,
        //                 "data": {
        //                     "hotelId": 57324,
        //                     "counterId": "QnFEZU9XK2o5bXc9",
        //                     "email": "Simbalodges2@hotelogix.com",
        //                     "forceOpenCouner": true,
        //                     "forceLogin": true
        //                 }
        //             }
        //         }
        //     };
            
        //     const signatureForLogin = await hotelogixSignature.createSignature(loginBodyData, consumerSecret);

        //     if (signatureForLogin.length!=0) {

        //         loginFunction.login(loginBodyData, signatureForLogin)
        //     }
        //     else {
        //         return {
        //             message: "please create signature first.."
        //         }
        //     }
        // }
        // else {
        //     return {
        //         error: result
        //     }
        // };

    }
}