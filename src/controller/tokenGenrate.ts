import jwt from "jsonwebtoken";
import messages from "../messages/index";
import { Request, Response } from "express";
import { LocalStorage } from "node-localstorage";

export default {
    createToken: async (req: Request, res: Response) => {

        const genRatedToken = jwt.sign({ ID: "57324" }, "token", {
            expiresIn: '365d'
        })
        const localStorage = new LocalStorage('./jwtToken');
        // localStorage.setItem("token", genRatedToken)
        const token = localStorage.getItem("token");
        
        res.send({
            statusCode: 200,
            message: messages.success.created,
            result: token
        });
    }
}