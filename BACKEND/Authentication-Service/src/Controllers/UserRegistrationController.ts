import { Request, Response } from "express";
import { ErrorHandler } from "../Utils/customErrorHandler";
import axios from "axios";
import SessionTokenProvidingService from "../Service/JwtSessionTokenService";
import RefreshTokenProvidingService from "../Service/JwtRefreshTokenService";
import { TokenServiceResponse } from "../Utils/tokenServiceResponse";
import bcrypt from "bcrypt"

const UserRegistrationController = async (req: Request, res: Response) => {
    try {

        // VALIDATE REQUIRED FIELDS
        if (!req.body.name || !req.body.number || !req.body.password || !req.body.role) {
            return ErrorHandler(
                'Missing required fields',
                new Error('Name, number, password, and role are required'),
                res,
                400
            );
        }

        // USER SERVICE URL FROM ENV VARIABLES
        const user_url = process.env.USER_SERVICE_URL
        const port = process.env.USER_PORT
        const userMakeUrl = `${user_url}:${port}/create`

        //CONVERTING PASSWORD INTO HASH
        const password = req.body.password
        const saltround = 10
        const salt = await bcrypt.genSalt(saltround)
        const passhash = await bcrypt.hash(password,salt)

        // DATA SENT TO USER SERVICE
        const data = {
            name: req.body.name,
            number: req.body.number,
            passhash: passhash,
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

            let sessionToken: TokenServiceResponse;
            let refreshToken: TokenServiceResponse;

            try {
                sessionToken = SessionTokenProvidingService(userData);
            } catch (tokenError) {
                return ErrorHandler(
                    "Error generating session token",
                    tokenError as Error,
                    res,
                    500
                );
            }

            try {
                refreshToken = RefreshTokenProvidingService();
            } catch (refreshError) {
                return ErrorHandler(
                    "Error generating refresh token",
                    refreshError as Error,
                    res,
                    500
                );
            }

            // CHECK TOKEN GENERATION FAILURE
            if (sessionToken.stat === "fail" || refreshToken.stat === "fail") {
                return ErrorHandler(
                    "Error in generating session or refresh token",
                    new Error("authentication fail"),
                    res,
                    500
                )
            }

            // STORE REFRESH TOKEN IN HTTPONLY COOKIE
            return res.cookie('refreshtoken', refreshToken.token, {
                httpOnly: true,
                sameSite: "strict",
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 DAYS
            })

            // SEND SESSION TOKEN TO CLIENT
            .json({ 'sessionToken': sessionToken.token })
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

export default UserRegistrationController