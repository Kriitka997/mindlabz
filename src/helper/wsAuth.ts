import axios from "axios";
import apiUrl from "../config/constant";
import message from "../messages/index";
import getUserAPi from "../controller/index";
import hotelogixSignature from "./hotelogixSignature";

export default {

    getingWsAuthKeys: async (bodyData: any, signature: any) => {
        //create signature pending...

        const wsAuthKeys = await axios.post(`${apiUrl.url}/wsauth`, bodyData, {
            headers: {
                "Content-Type": "application/json",
                "X-HAPI-Signature": signature
            }
        }
        );

        const apiResponse = wsAuthKeys.data.hotelogix.response;
        return apiResponse;


        // if (apiResponse.status.message === "success") {
        //     return apiResponse;
            // const accessData = {
            //     accesskey: wsAuthKeys.data.hotelogix.response.accesskey,
            //     accesssecret: wsAuthKeys.data.hotelogix.response.accesssecret
            // }
            
            // const getUserData = {
            //     "hotelogix": {
            //         "version": "1.0",
            //         "datetime": "2022-12-23T15:55:00+05:30",
            //         "request": {
            //             "method": "getusers",
            //             "key": accessData.accesskey,
            //             "data": {
            //             }
            //         }
            //     }
            // }
            // const signatureForUser = await hotelogixSignature.createSignature(getUserData, accessData.accesssecret);

            // if (signatureForUser.length!=0) {

            //     getUserAPi.getUsers.getUsers(getUserData, signatureForUser)
            // }
            // else {
            //     return {
            //         message: "please create signature first.."
            //     }
            // }
    //     }
    //     else {
    //         return {
    //             error: apiResponse
    //         }

    //     }
    }
}