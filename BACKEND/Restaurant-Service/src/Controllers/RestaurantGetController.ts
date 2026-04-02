import { Response, Request } from "express";
import { ErrorHandler } from "../Utils/customErrorHandler.js";
import { SuccessHandler } from "../Utils/customSuccessHandler.js";
import prisma from "../Config/prisma.js";

const RestaurantGetController = async (req:Request, res:Response) => {
    try {
        const restaurantId = req.params.id;

        if(!restaurantId){
            return ErrorHandler('Missing restaurant', new Error('Restaurant Id is required'), res, 400);
        }

        const restaurant = await prisma.restaurant.findUnique({
            where:{
                id: restaurantId
            }
        });

        if(!restaurant){
            return ErrorHandler('Restaurant not found', new Error('No Restaurant with the provided Id'), res, 404);
        }

        return SuccessHandler(restaurant, res, 200, 'Restaurant fetched successfully');

    }
    catch (error) {
        ErrorHandler('Error fetching restaurant', error as Error, res, 500);
    }
}

export default RestaurantGetController;