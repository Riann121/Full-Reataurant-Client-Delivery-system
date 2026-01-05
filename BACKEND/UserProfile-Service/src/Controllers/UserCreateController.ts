import { Request, Response } from "express";
import prisma from "../Config/prisma.js";
import { ErrorHandler } from "../Utils/customErrorHandler.js";
import { SuccessHandler } from "../Utils/customSuccessHandler.js";

//USER CREATION CONTROLLER
const createUserController = async (req:Request, res:Response) => {
    try {
        //VALIDATE REQUIRED FIELDS
        if(!req.body.name || !req.body.number || !req.body.passhash || !req.body.role){
            return ErrorHandler('Missing required fields', new Error('Name, number, passhash, and role are required'), res, 400);
        }

        try {
            try {
                //CHECK IF USER ALREADY EXISTS
                const exist = await prisma.client.findUnique({
                    where: {
                        number: req.body.number
                    }
                });
            } catch (error) {
                //HANDLE EXISTENCE CHECK ERROR
                ErrorHandler('This Number is already registered', error as Error, res, 409);
            }
            //CREATE NEW USER
            const user = await prisma.client.create({
            data: {
                name: req.body.name,
                number: req.body.number,
                passhash: req.body.passhash,
                role: req.body.role
            }
        });

        //EXCLUDE PASSHASH FROM RESPONSE
        const {passhash, ...showUser} = user    
        
        SuccessHandler(showUser, res, 201, 'User created successfully');

        } catch (error) {
            //HANDLE USER CREATION ERROR
            ErrorHandler('Error creating user', error as Error, res, 500);
        }

    } catch (error) {
        //HANDLE GENERAL ERROR
        ErrorHandler('User creation error', error as Error, res, 500);
    }
}

export default createUserController;