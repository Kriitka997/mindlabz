import { Request, Response } from "express";
import wsAuthFunction from "../helper/wsAuth";
import controllerFun from "./index";
import loginFunction from "../helper/login";
import getBooking from "./getBooking";
import hotelogixSign from "../helper/hotelogixSignature";
import userModel from "../mysqlConnection&Fun/mysql-function";
import messages from "../messages";

const currentDateTime = `${new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0]}+05:30`;
const consumerKey = "13E1DD90BF875A42B4CCED372344411A0A902520"
const consumerSecret = "076C70B9A1C4072EAC9091D46A6C502AD9D97DF7";


async function wsAuthAPICall() {

    const wsAuthBody = {
        "hotelogix": {
            "version": "1.0",
            "datetime": currentDateTime,
            "request": {
                "method": "wsauth",
                "key": consumerKey
            }
        }
    };
    const signatureForWsAuth = await hotelogixSign.createSignature(wsAuthBody, consumerSecret);

    const wsAuthResponse = await wsAuthFunction.getingWsAuthKeys(wsAuthBody, signatureForWsAuth);
    if (wsAuthResponse.status.message === "success") {

        const updateUserKeysModel = {
            consumerKey: consumerKey,
            consumerSecret: consumerSecret,
            wsauthAccessKey: wsAuthResponse.accesskey,
            wsauthAccessSecret: wsAuthResponse.accesssecret,
            loginAccessKey: null,
            loginAccessSecret: null,
            hotelId: null,
            counterId: null,
            email: null,
        }
        const addedDataInDb = await userModel.saveusersKeys(updateUserKeysModel);
        return {
            accesskey: wsAuthResponse.accesskey,
            accesssecret: wsAuthResponse.accesssecret,
            usersKeyInDb: addedDataInDb
        }
    }
    else {
        return {
            path: "wsAUth",
            status: wsAuthResponse,
        }
    }
}

async function getUsersAPICall(accessData: any, consumerKeyExits: any) {

    const getUserData = {
        "hotelogix": {
            "version": "1.0",
            "datetime": currentDateTime,
            "request": {
                "method": "getusers",
                "key": accessData.accesskey,
                "data": {
                }
            }
        }
    };
    const signatureForUser = await hotelogixSign.createSignature(getUserData, accessData.accesssecret);
    const getUserDataResponse = await controllerFun.getUsers.getUsers(getUserData, signatureForUser);
    if (getUserDataResponse.status.message == "success") {

        const hotelId = getUserDataResponse.hotels[0].id;
        consumerKeyExits.hotelId = hotelId;
        consumerKeyExits.counterId = "QnFEZU9XK2o5bXc9";
        consumerKeyExits.email = "Simbalodges2@hotelogix.com";
        const updatedDbKeys = await userModel.updateUserKeys(consumerKeyExits);

        return updatedDbKeys;
    }
    else {
        return {
            path: "getUsers",
            status: getUserDataResponse,
        }
    }
}

async function loginAPICall(consumerKeyExits: any) {

    const loginBodyData = {
        "hotelogix": {
            "version": "1.0",
            "datetime": currentDateTime,
            "request": {
                "method": "login",
                "key": consumerKey,
                "data": {
                    "hotelId": 57324,
                    "counterId": "QnFEZU9XK2o5bXc9",
                    "email": "Simbalodges2@hotelogix.com",
                    "forceOpenCouner": true,
                    "forceLogin": true
                }
            }
        }
    };
    const signatureForLogin = await hotelogixSign.createSignature(loginBodyData, consumerSecret);
    const loginResponse = await loginFunction.login(loginBodyData, signatureForLogin);
    if (loginResponse.status.message === "success") {

        if (consumerKeyExits) {
            consumerKeyExits.loginAccessKey = loginResponse.accesskey;
            consumerKeyExits.loginAccessSecret = loginResponse.accesssecret;
            await userModel.updateUserKeys(consumerKeyExits);
        }
        return {
            accesskey: loginResponse.accesskey,
            accesssecret: loginResponse.accesssecret
        }

    }
    else {
        return {
            path: "login user",
            status: loginResponse,
        }
    }
}

async function getBookingDetailsAPICall(accessData: any, roomNo: any) {
    
    const bookingData = {
        "hotelogix": {
            "version": "1.0",
            "datetime": currentDateTime,
            "request": {
                "method": "getbookings",
                "key": accessData.loginAccessKey,
                "data": {
                    "fromDate": "2020-10-13",
                    "toDate": "2020-10-13",
                    "searchBy": "STAYDATE",
                    "reservationStatus": [
                        "CHECKIN"
                    ],
                    "extraDetails": {
                        "Purpose": true,
                        "SalesPerson": true,
                        "CustomTag": true,
                        "CustomFields": true
                    }
                }
            }
        }
    };

    const signatureForBooking = await hotelogixSign.createSignature(bookingData, accessData.loginAccessSecret);

    const getBookingResponse = await getBooking(bookingData, signatureForBooking);

    if (getBookingResponse.status.message === "success") {

        let singleRoom: any = [];
        let allRooms: any = [];


        getBookingResponse.bookings.forEach((booking: any) => {
            let roomDetails = {
                room_no: '',
                checkin_id: '',
                checkin_date: '',
                adult: 0,
                guest_name: '',
                first_name: '',
                last_name: '',
                mobileNo: '',
                checkOutDate: '',
            };
            if (roomNo == booking.roomStays[0].roomName) {
                roomDetails['room_no'] = booking.roomStays[0].roomName;
                roomDetails['checkin_id'] = booking.guestStays[0].id;
                roomDetails['checkin_date'] = booking.guestStays[0].checkInDate;
                roomDetails['adult'] = 1;
                roomDetails['guest_name'] = booking.guestStays[0].guestDetails.fName + " " + booking.guestStays[0].guestDetails.lName;
                roomDetails['first_name'] = booking.guestStays[0].guestDetails.fName;
                roomDetails['last_name'] = booking.guestStays[0].guestDetails.lName;
                roomDetails['mobileNo'] = booking.guestStays[0].guestDetails.mobileNo;
                roomDetails['checkOutDate'] = booking.guestStays[0].checkOutDate;
                singleRoom.push(roomDetails);
            } else {
                roomDetails['room_no'] = booking.roomStays[0].roomName;
                roomDetails['checkin_id'] = booking.guestStays[0].id;
                roomDetails['checkin_date'] = booking.guestStays[0].checkInDate;
                roomDetails['adult'] = 1;
                roomDetails['guest_name'] = booking.guestStays[0].guestDetails.fName + " " + booking.guestStays[0].guestDetails.lName;
                roomDetails['first_name'] = booking.guestStays[0].guestDetails.fName;
                roomDetails['last_name'] = booking.guestStays[0].guestDetails.lName;
                roomDetails['mobileNo'] = booking.guestStays[0].guestDetails.mobileNo;
                roomDetails['checkOutDate'] = booking.guestStays[0].checkOutDate;
                allRooms.push(roomDetails);
            }
        });

        return {
            returnValue: roomNo ? singleRoom : allRooms,
        };


    }
    else {
        return {
            status: getBookingResponse.status,
        }
    }
}
export default {
    detailsOfRoom: async (req: Request, res: Response) => {
        let wsAuthAccessData: any;
        let loginAccessData: any;

        if (req.params.ID) {

            const userExits: any = await userModel.getEntity(req.query.token);

            if (userExits) {

                const roomNo: any = req.query.roomNo;

                const consumerKeyExits = await userModel.findConsumerKey(consumerKey);

                if (!consumerKeyExits) {

                    //calling wsAuth API
                    const wsAuthReturn = await wsAuthAPICall();

                    wsAuthAccessData = {
                        accesskey: wsAuthReturn.accesskey,
                        accesssecret: wsAuthReturn.accesssecret
                    }

                    // calling Get users data api
                    const getUserReturn = await getUsersAPICall(wsAuthAccessData, wsAuthReturn.usersKeyInDb);

                    // calling login api
                    const loginReturn = await loginAPICall(getUserReturn);

                    loginAccessData = loginReturn;

                    //calling get bookings details api

                    const getBookingReturn = await getBookingDetailsAPICall(loginAccessData, roomNo);

                    //sending response to vendor
                    if (getBookingReturn.status) {
                        return res.send({
                            path: "get Bookings",
                            status: getBookingReturn.status,

                        })
                    }
                    else {
                        res.send({
                            status: 200,
                            message: "Room Details retrived successfully.",
                            result: getBookingReturn.returnValue
                        })
                    }
                }
                // if consumer key is founded in db then calling get booking details api directly.. 
                else {
                    const loginAccessData = {
                        loginAccessKey: consumerKeyExits.loginAccessKey,
                        loginAccessSecret: consumerKeyExits.loginAccessSecret,
                    };

                    const getBookingReturn = await getBookingDetailsAPICall(loginAccessData, roomNo);

                    if (getBookingReturn.status) {
                        return res.send({
                            path: "get Bookings",
                            status: getBookingReturn.status,

                        })
                    }
                    res.send({
                        status: 200,
                        message: "Room Details retrived successfully.",
                        result: getBookingReturn.returnValue
                    })
                }

            }
            else {
                res.send({
                    message: messages.error.forbidden
                })
            }
        }
    }
}