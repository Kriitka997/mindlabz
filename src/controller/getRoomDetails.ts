import { Request, Response } from "express";
import wsAuthFunction from "../helper/wsAuth";
import controllerFun from "./index";
import loginFunction from "../helper/login";
import getBooking from "./getBooking";
import hotelogixSign from "../helper/hotelogixSignature";

export default {
    detailsOfRoom: async (req: Request, res: Response) => {
        const roomNo: any = req.query.roomNo;

        const detailsOfUser: any = [];
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

            // const response = await
            const wsAuthResponse = await wsAuthFunction.getingWsAuthKeys(wsAuthBody, signatureForWsAuth);

            if (wsAuthResponse.status.message === "success") {
                const accessData = {
                    accesskey: wsAuthResponse.accesskey,
                    accesssecret: wsAuthResponse.accesssecret
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

                                        let bookingDetails = {
                                            room_no: '',
                                            checkin_id: '',
                                            adult: 0,
                                            guest_name: '',
                                            first_name: '',
                                            last_name: '',
                                            mobileNo: '',
                                            checkOutDate: '',
                                        };
                                        getBookingResponse.bookings.forEach((booking: any) => {
                                            bookingDetails['room_no'] = roomNo;
                                            bookingDetails['checkin_id'] = booking.guestStays[0].id;
                                            bookingDetails['adult'] = 1;
                                            bookingDetails['guest_name'] = booking.guestStays[0].guestDetails.fName + " " + booking.guestStays[0].guestDetails.lName;
                                            bookingDetails['first_name'] = booking.guestStays[0].guestDetails.fName;
                                            bookingDetails['last_name'] = booking.guestStays[0].guestDetails.lName;
                                            bookingDetails['mobileNo'] = booking.guestStays[0].guestDetails.mobileNo;
                                            bookingDetails['checkOutDate'] = booking.guestStays[0].checkOutDate;

                                        });


                                        // const filterByRoomNo = detailsOfUser[0].filter((Rno: any) => {
                                        //     if (Rno.roomName == roomNo) {
                                        //         res.send({
                                        //             status: 200,
                                        //             message: "Room Details retrived successfully.",
                                        //             result: detailsOfUser
                                        //         });
                                        //     }

                                        // });

                                        res.send({
                                            status: 200,
                                            message: "Room Details retrived successfully.",
                                            result: bookingDetails
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
}