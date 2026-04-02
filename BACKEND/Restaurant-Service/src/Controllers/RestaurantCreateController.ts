import { Response,Request } from "express";

import { ErrorHandler } from "../Utils/customErrorHandler.js";
import { SuccessHandler } from "../Utils/customSuccessHandler.js";
import prisma from "../Config/prisma.js";  


const RestaurantCreateController = async (req:Request, res:Response) => {
    try {
        const { name, address} = req.body;
        const user_id = req.body.auth.userId;

        //VALIDATE REQUIRED FIELDS
        if(!name || !address){
            return ErrorHandler('Missing required fields', new Error('Name and address are required'), res, 400);
        }
        if(!user_id){
            return ErrorHandler('Unauthorized', new Error('User authentication required'), res, 401);
        }
        //CREATE RESTAURANT
        try {
            const restaurant = await prisma.restaurant.create({
            data: {
                name,
                address,
                owner: [user_id],
            }
            });

            SuccessHandler(restaurant,res,201,'Restaurant created successfully');

        } catch (error) {
            return ErrorHandler('Error creating restaurant', error as Error, res, 500); 
        }
        

    } catch (error) {
        ErrorHandler('Error creating restaurant', error as Error, res, 500);
    }
}

export default RestaurantCreateController;