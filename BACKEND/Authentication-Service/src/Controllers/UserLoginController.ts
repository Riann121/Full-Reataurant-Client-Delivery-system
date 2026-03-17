import { Request, Response } from "express";
import { ErrorHandler } from "../Utils/customErrorHandler";
import { SuccessHandler } from "../Utils/customSuccessHandler";
import axios from "axios";
import "dotenv/config"
import UserVerification from "../Service/UserVerificationService";
import SessionTokenProvidingService from "../Service/JwtSessionTokenService";
import RefreshTokenProvidingService from "../Service/JwtRefreshTokenService";

const UserLoginController = async (req:Request, res:Response)=>{
    try {
        // CHECK REQUIRED FIELDS
        if(!req.body.number || !req.body.password ){
           return ErrorHandler(
                'Missing required fields',
                new Error('Number and password are required'),
                res,
                400
            ); 
        }

        // AUTH TOKEN
        const token = process.env.AUTH_SECRET

        // USER SERVICE URL
        const number = req.body.number
        const user_url = process.env.USER_SERVICE_URL
        const port = process.env.USER_PORT
        const userMakeUrl = `${user_url}:${port}/auth/${number}`

        // CALL USER SERVICE
        const axios_res = await axios.get(userMakeUrl, {
            headers: { "x-api-key": token }
        });

        const userData = axios_res.data.data;
        const passhash = axios_res.data.data.passhash;

        // VERIFY PASSWORD
        const password = req.body.password
        const verify = await UserVerification(passhash, password)

        if(verify){
            // GENERATE SESSION AND REFRESH TOKENS
            const sessionToken = SessionTokenProvidingService(userData)
            const refreshToken = RefreshTokenProvidingService()

            // CHECK TOKEN GENERATION FAILURE
            if (sessionToken?.stat === "fail" || refreshToken?.stat === "fail") {
                return ErrorHandler(
                    "Error generating session or refresh token",
                    new Error("Authentication fail"),
                    res,
                    500
                )
            }

            // STORE REFRESH TOKEN IN HTTPONLY COOKIE AND SEND SESSION TOKEN
            return res.cookie('refreshtoken', refreshToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            }).json({ sessionToken })

        } else {
            // WRONG PASSWORD
            return ErrorHandler(
                "Wrong password",
                new Error("Authentication fail"),
                res,
                401
            )
        }

    } catch (error) {
        // GENERAL LOGIN ERROR
        return ErrorHandler('Error logging in user', error as Error, res, 500);
    }
}

export default UserLoginController;