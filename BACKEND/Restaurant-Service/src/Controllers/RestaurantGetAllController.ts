import { Response, Request } from "express";
import { ErrorHandler } from "../Utils/customErrorHandler.js";
import { SuccessHandler } from "../Utils/customSuccessHandler.js";
import prisma from "../Config/prisma.js";

const RestaurantGetAllController = async (req:Request, res:Response) => {
    try {
        const restaurants = await prisma.restaurant.findMany();

        return SuccessHandler(restaurants, res, 200, 'Restaurants fetched successfully');
    }
    catch (error) {
        ErrorHandler('Error fetching restaurants', error as Error, res, 500);
    }
}

export default RestaurantGetAllController;