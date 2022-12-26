import jwt from "jsonwebtoken";
import message from "../messages/error-response";
import { Request, Response, NextFunction } from "express";

export default {

    verifyToken: async (req: Request, res: Response, next: NextFunction) => {

        const authToken:any = req.query.token;        

        jwt.verify(authToken, 'token', (err: any, user: any) => {
            if (err) {
                res.send({
                    status: 404,
                    error: message.invalid
                })
            }
            else {                
                req.params = user;
                next()
            }
        });
    }
}