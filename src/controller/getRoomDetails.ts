import { Request, Response } from "express";
import wsAuthFunction from "../helper/wsAuth";
import controllerFun from "./index";
import loginFunction from "../helper/login";
import getBooking from "./getBooking";
import hotelogixSign from "../helper/hotelogixSignature";
import userModel from "../mysqlConnection&Fun/mysql-function";
import messages from "../messages";

export default {
    detailsOfRoom: async (req: Request, res: Response) => {

        if (req.params.ID) {

            const userExits: any = await userModel.getEntity(req.query.token);

            if (userExits) {
                const roomNo: any = req.query.roomNo;

                const currentDateTime = `${new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0]}+05:30`;
                const consumerKey = "13E1DD90BF875A42B4CCED372344411A0A902520"
                const consumerSecret = "076C70B9A1C4072EAC9091D46A6C502AD9D97DF7";

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

                if (signatureForWsAuth.length != 0) {

                    const wsAuthResponse = await wsAuthFunction.getingWsAuthKeys(wsAuthBody, signatureForWsAuth);

                    if (wsAuthResponse.status.message === "success") {
                        const accessData = {
                            accesskey: wsAuthResponse.accesskey,
                            accesssecret: wsAuthResponse.accesssecret
                        };
                        const consumerKeyExits = await userModel.findConsumerKey(consumerKey);

                        if (!consumerKeyExits) {
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
                            await userModel.saveusersKeys(updateUserKeysModel);
                        }

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
                        }
                        const signatureForUser = await hotelogixSign.createSignature(getUserData, accessData.accesssecret);

                        if (signatureForUser.length != 0) {
                            const getUserDataResponse = await controllerFun.getUsers.getUsers(getUserData, signatureForUser);

                            if (getUserDataResponse.status.message == "success") {

                                const hotelId = getUserDataResponse.hotels[0].id;
                                // const counterId = getUserDataResponse.hotels[0].users[0].counters[0].id;
                                const consumerKeyExits = await userModel.findConsumerKey(consumerKey);
                                if (consumerKeyExits) {
                                    consumerKeyExits.hotelId = hotelId;
                                    consumerKeyExits.counterId = "QnFEZU9XK2o5bXc9";
                                    consumerKeyExits.email = "Simbalodges2@hotelogix.com";
                                };
                                // console.log(getUserDataResponse.hotels[0].users.length, "TWx3THRWVVk3UU09");
                                // const lengthOfData = getUserDataResponse.hotels[0].users.length;
                                // for (let i = 0; i < lengthOfData; i++) {
                                //     console.log(getUserDataResponse.hotels[0].users[i]);

                                // }

                                await userModel.updateUserKeys(consumerKeyExits);

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

                                if (signatureForLogin.length != 0) {

                                    const loginResponse = await loginFunction.login(loginBodyData, signatureForLogin);
                                    if (loginResponse.status.message === "success") {
                                        const consumerKeyExits = await userModel.findConsumerKey(consumerKey);
                                        if (consumerKeyExits) {
                                            consumerKeyExits.loginAccessKey = loginResponse.accesskey;
                                            consumerKeyExits.loginAccessSecret = loginResponse.accesssecret;
                                            await userModel.updateUserKeys(consumerKeyExits);
                                        }
                                        const accessData = {
                                            accesskey: loginResponse.accesskey,
                                            accesssecret: loginResponse.accesssecret
                                        }

                                        const bookingData = {
                                            "hotelogix": {
                                                "version": "1.0",
                                                "datetime": currentDateTime,
                                                "request": {
                                                    "method": "getbookings",
                                                    "key": accessData.accesskey,
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
                                        const signatureForBooking = await hotelogixSign.createSignature(bookingData, accessData.accesssecret);

                                        if (signatureForBooking.length != 0) {

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

                                                res.send({
                                                    status: 200,
                                                    message: "Room Details retrived successfully.",
                                                    result: roomNo ? singleRoom : allRooms,
                                                });


                                            }
                                            else {
                                                res.send({
                                                    path: "booking",
                                                    status: getBookingResponse.status,
                                                })
                                            }
                                        }
                                    } else {
                                        res.send({
                                            path: "login",
                                            status: loginResponse,
                                        })
                                    }
                                }
                                else {
                                    res.send({
                                        message: "please create signature first.."
                                    })
                                }
                            }
                            else {
                                res.send({
                                    path: "getUsers",
                                    status: getUserDataResponse,
                                })
                            }
                        }
                        else {
                            res.send({
                                message: "please create signature first.."
                            })
                        }

                    } else {
                        res.send({
                            path: "wsAUth",
                            status: wsAuthResponse,
                        })
                    }
                }
                else {
                    res.send({
                        message: "please create signature first.."
                    })
                }
            }
            else {
                res.send({
                    message: messages.error.notFound
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