import axios from "axios";
import apiUrl from "../config/constant";
import message from "../messages/index";
import { Request, Response } from "express";

export default {

    gettingRoomDetails: async (req: Request, res: Response) => {

        const userID = req.params.vendorIds
        //create signature pending...

        if (userID) {
            const headerParams = {
                contentType: req.headers.contenttype,
                xHAPISign: req.headers.xhapisignature
            };
            const queryParams = {
                roomNo: req.query.roomNo,
            }

            const roomDetails = await axios.post(`${apiUrl.url}/wsauth?${queryParams.roomNo}`, {
                headers: {
                    contentType: headerParams.contentType,
                    xHAPISign: headerParams.xHAPISign
                }
            }
            );

            if (roomDetails) {
                res.send({
                    message: message.success.details,
                    result: roomDetails
                })
            }
            else {
                res.send({
                    error: message.error.parameters
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