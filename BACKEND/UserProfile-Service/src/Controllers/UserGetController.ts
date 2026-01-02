import {Request,Response} from 'express';
import { ErrorHandler } from '../Utils/customErrorHandler.js';
import prisma from '../Config/prisma.js';


//USER GET ALL CONTROLLER
const UserGetAllController = async (req:Request, res:Response) => {
    try {
        const clientId = req.params.id;
        if(req.params.id === undefined){
            //HANDLE MISSING NUMBER PARAMETER
            return ErrorHandler('Missing user', new Error('Client Id is required'), res, 400);
        }
        //FIND USER BY NUMBER
        const user = await prisma.client.findMany({
            where:{id: clientId}
        });
        if (!user) {
            //HANDLE USER NOT FOUND
            ErrorHandler('User not found', new Error('No Client with the provided Id'), res, 404);
        }
        else {
            //EXCLUDE PASSHASH FROM RESPONSE
            const showUser = user.map(({passhash, ...rest}) => rest);

            //SEND USER DATA RESPONSE
            res.json({ showUser });
        }
    } catch (error) {
        //HANDLE GENERAL ERROR
        ErrorHandler('Error retrieving User', error as Error, res, 500);
    }
};

export default UserGetAllController;