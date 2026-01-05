import { Request, Response } from 'express';
import { ErrorHandler } from '../Utils/customErrorHandler.js';
import prisma from '../Config/prisma.js';
import {ClientWhereInput } from '../../generated/prisma/models.js';
import { SuccessHandler } from '../Utils/customSuccessHandler.js';

//USER FIND CONTROLLER WHERE qtype CAN BE id, number, name
const FindUserController = async (req: Request, res: Response) => {
    try {
        const key = req.params.qtype
        const value = req.params.value;
        if (!key || !value) {
            return ErrorHandler('Missing parameters', new Error('Both qtype and value are required'), res, 400);
        }
        const query:ClientWhereInput = {};
        //DYNAMIC QUERY CONSTRUCTION BASED ON qtype
        if (key === 'id') {
            query.id = value;
        } else if (key === 'number') {
            query.number = value;
        } else if (key === 'name') {
            query.name = { contains: value };
        } else {
            //HANDLE INVALID QTYPE
            return ErrorHandler('Invalid qtype', new Error('qtype must be one of id, number, or name'), res, 400);
        }

        try {
            //FIND USER BASED ON DYNAMIC QUERY
            const user = await prisma.client.findMany({
                where: query
            });
            if (user.length === 0) {
                //HANDLE USER NOT FOUND
                return ErrorHandler('User not found', new Error('No user matches the provided criteria'), res, 404);
            }
            //EXCLUDE PASSHASH FROM RESPONSE
            const showUser = user.map(({ passhash, ...rest }) => rest);
            //SEND SUCCESS RESPONSE
            SuccessHandler(showUser, res, 200, 'User found successfully');

    } catch (error) {
        //HANDLE GENERAL ERROR
        ErrorHandler('Error retrieving User', error as Error, res, 500);
      }
        
    }
    catch (error) {
        //HANDLE GENERAL ERROR
        ErrorHandler('Error processing request', error as Error, res, 500);
    }
};

export default FindUserController;