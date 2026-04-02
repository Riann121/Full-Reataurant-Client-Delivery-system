import { ErrorHandler } from "../Utils/customErrorHandler.js";
import { SuccessHandler } from "../Utils/customSuccessHandler.js";
import { prisma } from "../Config/prisma.js";
const RestaurantGetAllController = async (req, res) => {
    try {
        const restaurants = await prisma.restaurant.findMany();
        return SuccessHandler(restaurants, res, 200, "Restaurants fetched successfully");
    }
    catch (error) {
        return ErrorHandler("Error fetching restaurants", error, res, 500);
    }
};
export default RestaurantGetAllController;
