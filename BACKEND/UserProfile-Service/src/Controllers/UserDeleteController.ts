import {Request,Response} from 'express';
import { ErrorHandler } from '../Utils/customErrorHandler.js';
import prisma from '../Config/prisma.js';
import { SuccessHandler } from '../Utils/customSuccessHandler.js';

//USER DELETE CONTROLLER
const UserDeleteController = async (req:Request, res:Response) => {
    try {
        const clientId = req.params.id;
        if(req.params.id === undefined){
            //HANDLE MISSING NUMBER PARAMETER
            return ErrorHandler('Missing user', new Error('Client Id is required'), res, 400);
        }
        try {
            //DELETE USER BY ID
            const user = await prisma.client.delete({
                where:{id: clientId}
            });
            if(!user){
                //HANDLE USER NOT FOUND
                return ErrorHandler('User not found', new Error('No Client with the provided Id'), res, 404);
            }
            if(user){
                //SEND SUCCESS RESPONSE
                return SuccessHandler({}, res, 200, 'User deleted successfully');
            }
        } catch (error) {
            ErrorHandler('Error deleting User try again', error as Error, res, 500);
        }
       
    } catch (error) {
        //EANDLE GENERAL ERROR
        ErrorHandler('Error processing request', error as Error, res, 500);
    }
};

export default UserDeleteController;