import { Request, Response } from "express";
import { ErrorHandler } from "../Utils/customErrorHandler.js";

const UserUpdateController = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        ErrorHandler('Error updating user', error as Error, res, 500);
    }
}
