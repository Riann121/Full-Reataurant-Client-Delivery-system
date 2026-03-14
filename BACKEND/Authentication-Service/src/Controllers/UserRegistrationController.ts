import {  Request, Response } from "express";
import { ErrorHandler } from "../Utils/customErrorHandler";
import axios from "axios";
import SessionTokenProvidingService from "../Service/JwtSessionTokenService";
import RefreshTokenProvidingService from "../Service/JwtRefreshTokenService";
import strict from "node:assert/strict";

const UserRegistrationContorller = async (req:Request, res:Response) => {
    try {
        //VALIDATE REQUIRED FIELDS
        if(!req.body.name || !req.body.number || !req.body.passhash || !req.body.role){
            return ErrorHandler('Missing required fields', new Error('Name, number, passhash, and role are required'), res, 400);
        }


        const user_url = process.env.USER_SERVICE_URL
            const port = process.env.USER_PORT
            const userMakeUrl = `${user_url}:${port}/create`
            const data = {
                name: req.body.name,
                number: req.body.number,
                passhash: req.body.passhash,
                role: req.body.role
            }
            const axios_res = await axios.post(userMakeUrl, data)
            if(axios_res.status != 201){
                const userError = axios_res.data
                return res.json(userError)
            }
            else{
                const userCreate = axios_res.data
                const userData = axios_res.data.data

                const sessionToken = SessionTokenProvidingService(userData)
                const refreshToken = RefreshTokenProvidingService()

                if(sessionToken?.stat === "fail"|| refreshToken?.stat === "fail"){
                    ErrorHandler("Error in generating session or refresh token",Error("authenticaton fail"),res,500)
                }
                //PASSING DATA, SESSION TOKEN AND REFRESH TOKEN    
                res.cookie('refreshtoken',refreshToken,{
                    httpOnly:true,
                    sameSite:"strict",
                    secure:true,
                    maxAge:7*24*60*60*1000 
                    })
                .json({'sessionToken':sessionToken})
                    
            }
    } catch (error) {
        //HANDLE GENERAL ERROR
        ErrorHandler('Error Registering user', error as Error, res, 401);
    }
}

export default UserRegistrationContorller