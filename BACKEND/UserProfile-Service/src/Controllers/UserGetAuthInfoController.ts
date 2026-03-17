import {Request,Response} from 'express';
import { ErrorHandler } from '../Utils/customErrorHandler.js';
import prisma from '../Config/prisma.js';
import { SuccessHandler } from '../Utils/customSuccessHandler.js';

//USER GET AUTHENTICATION INFO CONTROLLER
const UserGetAuthInfoController = async (req:Request, res:Response) => {
    try {
        const clientNumber = req.params.number;
        if(req.params.number === undefined){
            //HANDLE MISSING NUMBER PARAMETER
            return ErrorHandler('Missing number', new Error('Phone Number is required'), res, 400);
        }
        if(!req.body.isFromAuth){
            //HANDLE MISSING  AUTHORIZATION TOKEN
            return ErrorHandler('Missing Authorization token', new Error('Unauthorized request'), res, 400);
        }

        //FIND USER BY ClientId
        const user = await prisma.client.findMany({
            where:{number: clientNumber}
        });
        if (!user) {
            //HANDLE USER NOT FOUND
            return ErrorHandler('User not found', new Error('No Client with the provided number'), res, 404);
        }
        else {
            //SEND USER DATA RESPONSE
            return SuccessHandler(user, res, 200, 'User retrieved successfully');
        }
    } catch (error) {
        //HANDLE GENERAL ERROR
        ErrorHandler('Error retrieving User', error as Error, res, 500);
    }
};

export default UserGetAuthInfoController;