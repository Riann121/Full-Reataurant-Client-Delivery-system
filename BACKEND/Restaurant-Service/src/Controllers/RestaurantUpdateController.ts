import { Response, Request } from "express";
import { ErrorHandler } from "../Utils/customErrorHandler.js";
import { SuccessHandler } from "../Utils/customSuccessHandler.js";
import prisma from "../Config/prisma.js";

const RestaurantUpdateController = async (req:Request, res:Response) => {
    try {
        const restaurantId = req.params.id;
        const userId = req.body.auth.userId;
        const role = req.body.auth.role;
        const { name, address, member, food } = req.body;

        if(!restaurantId){
            return ErrorHandler('Missing restaurant', new Error('Restaurant Id is required'), res, 400);
        }
        if(!userId || !role){
            return ErrorHandler('Unauthorized', new Error('User authentication required'), res, 401);
        }

        // Only OWNER role can update (and they must be one of the owners of the restaurant)
        if (role === 'OWNER') {
            // Check if the restaurant exists and user is one of the owners
            const existingRestaurant = await prisma.restaurant.findUnique({
                where: { id: restaurantId }
            });

            if (!existingRestaurant) {
                return ErrorHandler('Restaurant not found', new Error('No Restaurant with the provided Id'), res, 404);
            }

            // Check if the user is in the owner array
            if (!existingRestaurant.owner.includes(userId)) {
                return ErrorHandler('Forbidden', new Error('You are not the owner of this restaurant'), res, 403);
            }

            const updatedRestaurant = await prisma.restaurant.update({
                where: {
                    id: restaurantId
                },
                data: {
                    name: name || existingRestaurant.name,
                    address: address || existingRestaurant.address,
                    member: member || existingRestaurant.member,
                    food: food || existingRestaurant.food
                }
            });

            return SuccessHandler(updatedRestaurant, res, 200, 'Restaurant updated successfully');
        } else {
            return ErrorHandler('Forbidden', new Error('Only restaurant owners can update their restaurants'), res, 403);
        }

    }
    catch (error) {
        ErrorHandler('Error updating restaurant', error as Error, res, 500);
    }
}

export default RestaurantUpdateController;