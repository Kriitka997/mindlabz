import axios from "axios";
import constant from "../config/constant";
import { Request, Response } from "express";


export default {

    getCheckInDetails: async (req: Request, res: Response) => {
        //create signature pending...

        const headerParams = {
            contentType: req.headers.contenttype,
            xHAPISign: req.headers.xhapisignature
        };

        const bodyParams = req.body
        const getCheckInData = await axios.post(`${constant.url}/getcheckins`, bodyParams, {
            headers: {
                contentType: headerParams.contentType,
                xHAPISign: headerParams.xHAPISign
            },
        });

        res.send({
            statusCode: 200,
            result: getCheckInData
        });
    }
};