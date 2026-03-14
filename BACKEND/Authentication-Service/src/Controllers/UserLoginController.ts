import { Request, Response } from "express";
import { ErrorHandler } from "../Utils/customErrorHandler";
import { SuccessHandler } from "../Utils/customSuccessHandler";


const UserLoginController = async (req:Request, res:Response)=>{
    try {
        
    } catch (error) {
        //HANDLE GENERAL ERROR
        ErrorHandler('Error Logging in user', error as Error, res, 401);
    }
}