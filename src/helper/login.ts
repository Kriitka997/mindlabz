import axios from "axios";
import { Request, Response } from "express";
import apiUrl from "../config/constant";
const LocalStorage = require("node-localstorage").LocalStorage,
  localStorage = new LocalStorage("./data");
async function login(req: Request, res: Response) {
  const headerParams = {
    contentType: req.headers.contenttype,
    xHAPISign: req.headers.xhapisignature,
  };

  const bodyParams = req.body;
  const loginDetails = await axios.post(`${apiUrl.url}/login`, req.body, {
    headers: {
      contentType: headerParams.contentType,
      xHAPISign: headerParams.xHAPISign,
    },
  });
  const response = await loginDetails.data.hotelogix.response;

  if (response.status.message === "Success") {
    return res.send({
      accesskey: response.accesskey,
      accesssecret: response.accesssecret,
    });
  } else {
    return res.send({
      status: response.status,
    });
  }
  /*
  {
    "hotelogix": {
        "version": "1.0",
        "datetime": "2012-01-16T10:10:15",
        "response": {
            "status": {
                "code": 0,
                "message": "Success"
            },
            "accesskey": "NO4CIu615R|enRW",
            "accesssecret": "yjEZZrrP6t3ztoi"
        },
        "request": {
            "method": "login",
            "key": "NO4CIu615RenRW",
            "data": {
                "hotelId": 1258,
                "counterId": 506,
                "email": "user1@gmail.com",
                "password": "123456",
                "forceOpenCouner": true,
                "forceLogin": true
            }
        }
    }
} */
}

export default login;
