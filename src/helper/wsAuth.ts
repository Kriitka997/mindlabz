import axios from "axios";
import apiUrl from "../config/constant";
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

    }
}