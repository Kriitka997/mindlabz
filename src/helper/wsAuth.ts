import axios from "axios";
import apiUrl from "../config/constant";
import message from "../messages/index";
import { Request, Response } from "express";

export default {

    gettingDetails: async (req: Request, res: Response) => {

        const userID = req.params.vendorIds
        //create signature pending...

        if (userID) {

            const queryParams = {
                roomNo: req.query.roomNo,
            }

            const roomDetails = await axios.post(`${apiUrl.url}/wsauth`, req.body, {
                headers: {
                    contentType: req.headers["content-type"],
                    xHAPISign: req.headers["x-hapi-signature"]
                }
            }
            );
            const result = roomDetails.data.hotelogix.response;
            if (result.status.message == "success") {
                res.send({
                    accesskey: result.accesskey,
                    accesssecret: result.accesssecret
                })
            }
            else {
                res.send({
                    error: result
                })
            }
        }
        else {
            res.send({
                error: message.error.notMatched
            })
        }
    }
}