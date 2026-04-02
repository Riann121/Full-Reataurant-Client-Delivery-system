import { Response, Request } from "express";
import { ErrorHandler } from "../Utils/customErrorHandler.js";
import { SuccessHandler } from "../Utils/customSuccessHandler.js";
import prisma from "../Config/prisma.js";

const RestaurantDeleteController = async (req:Request, res:Response) => {
    try {
        const restaurantId = req.params.id;
        const userId = req.body.auth.userId;
        const role = req.body.auth.role;

        //VALIDATE REQUIRED FIELDS
        if(!restaurantId){
            return ErrorHandler('Missing restaurant', new Error('Restaurant Id is required'), res, 400);
        }
        if(!userId || !role){
            return ErrorHandler('Unauthorized', new Error('User authentication required'), res, 401);
        }
        if (role === 'OWNER'){

            //ADMIN CAN DELETE ANY RESTAURANT
            const restaurant = await prisma.restaurant.delete({
                where:{
                    id: restaurantId,
                    owner: userId
                
                }
            });
            if(!restaurant){
                return ErrorHandler('Restaurant not found', new Error('No Restaurant with the provided Id'), res, 404);
            }
            return SuccessHandler({}, res, 200, 'Restaurant deleted successfully');
        }
        else {
            //OTHER ROLES CANNOT DELETE RESTAURANT
            return ErrorHandler('Forbidden', new Error('Only restaurant owners can delete their restaurants'), res, 403);
        }
    }
    catch (error) {
        ErrorHandler('Error processing request', error as Error, res, 500);
    }
}

export default RestaurantDeleteController