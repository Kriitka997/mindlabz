import apiUrl from "../config/constant";
import { Request, Response } from "express";
import axios from "axios";

export default {
    getUsers: async (req: Request, res: Response) => {

        const getUsersDetails = await axios.post(`${apiUrl.url}/getusers`, req.body, {
            headers: {
                contentType: req.headers["content-type"],
                xHAPISign: req.headers["x-hapi-signature"]
            }
        }
        );
        const result = getUsersDetails.data.hotelogix.response;

        if (result.status.message == "success") {
            res.send({
                result: result,
            })
        }
        else {
            res.send({
                error: result
            })
        }

    }
}