import jwt from "jsonwebtoken";
import messages from "../messages/index";
import { Request, Response } from "express";
import TokenModel from "../mysqlConnection&Fun/mysql-function";

export default {
    createToken: async (req: Request, res: Response) => {
        const vendorID = Number(req.query.vendorId);
        let token: any

        const genRatedToken = jwt.sign({ ID: vendorID }, "token", {
            expiresIn: '365d'
        })
        const vendorData = {
            vendorId: vendorID,
            vendorToken: genRatedToken,
        }
        const findVendor = await TokenModel.findVendorById(vendorID);

        if (findVendor) {

            findVendor.vendorToken = genRatedToken;
            findVendor.updatedDate = new Date();
            const updatedToken = await TokenModel.updateVendor(findVendor);
            token = updatedToken.vendorToken

        }
        else {
            const createdToken = await TokenModel.saveVendorData(vendorData);
            token = createdToken.vendorToken
        }

        if (token) {
            res.send({
                statusCode: 200,
                message: messages.success.created,
                result: token
            });
        }
        else {
            res.send({
                message: messages.error.notCreate
            })
        }

    }
};

