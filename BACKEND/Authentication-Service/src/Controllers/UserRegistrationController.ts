import { Request, Response } from "express";
import { ErrorHandler } from "../Utils/customErrorHandler";
import axios from "axios";
import SessionTokenProvidingService from "../Service/JwtSessionTokenService";
import RefreshTokenProvidingService from "../Service/JwtRefreshTokenService";

const UserRegistrationContorller = async (req: Request, res: Response) => {
    try {

        // VALIDATE REQUIRED FIELDS
        if (!req.body.name || !req.body.number || !req.body.passhash || !req.body.role) {
            return ErrorHandler(
                'Missing required fields',
                new Error('Name, number, passhash, and role are required'),
                res,
                400
            );
        }

        // USER SERVICE URL FROM ENV VARIABLES
        const user_url = process.env.USER_SERVICE_URL
        const port = process.env.USER_PORT
        const userMakeUrl = `${user_url}:${port}/create`

        // DATA SENT TO USER SERVICE
        const data = {
            name: req.body.name,
            number: req.body.number,
            passhash: req.body.passhash,
            role: req.body.role
        }

        // CREATE USER VIA USER SERVICE
        const axios_res = await axios.post(userMakeUrl, data)

        // HANDLE USER SERVICE ERROR
        if (axios_res.status != 201) {
            const userError = axios_res.data
            return res.json(userError)
        }
        else {

            // EXTRACT USER DATA
            const userCreate = axios_res.data
            const userData = axios_res.data.data

            // GENERATE ACCESS TOKEN (SESSION TOKEN)
            const sessionToken = SessionTokenProvidingService(userData)

            // GENERATE REFRESH TOKEN
            const refreshToken = RefreshTokenProvidingService()

            // CHECK TOKEN GENERATION FAILURE
            if (sessionToken?.stat === "fail" || refreshToken?.stat === "fail") {
                ErrorHandler(
                    "Error in generating session or refresh token",
                    Error("authenticaton fail"),
                    res,
                    500
                )
            }

            // STORE REFRESH TOKEN IN HTTPONLY COOKIE
            res.cookie('refreshtoken', refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 DAYS
            })

            // SEND SESSION TOKEN TO CLIENT
            .json({ 'sessionToken': sessionToken })
        }

    } catch (error) {

        // GENERAL ERROR HANDLER
        ErrorHandler(
            'Error Registering user',
            error as Error,
            res,
            401
        );
    }
}

export default UserRegistrationContorller