import jwt from "jsonwebtoken";
import messages from "../messages/index";
import { Request, Response } from "express";

export default {
    createToken: async (req: Request, res: Response) => {

        const genRatedToken = jwt.sign({ ID: "57324" }, "token", {
            expiresIn: '365d'
        })
        res.send({
            statusCode: 200,
            message: messages.success.created,
            result: genRatedToken
        });
    }
}