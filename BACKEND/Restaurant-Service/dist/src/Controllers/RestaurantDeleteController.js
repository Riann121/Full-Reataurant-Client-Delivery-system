import { ErrorHandler } from "../Utils/customErrorHandler.js";
import { SuccessHandler } from "../Utils/customSuccessHandler.js";
import { prisma } from "../Config/prisma.js";
const RestaurantDeleteController = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const auth = req.body.auth;
        if (!restaurantId) {
            return ErrorHandler("Missing restaurant", new Error("Restaurant Id is required"), res, 400);
        }
        if (!auth || !auth.userId || !auth.role) {
            return ErrorHandler("Unauthorized", new Error("User authentication required"), res, 401);
        }
        const userId = auth.userId;
        const role = auth.role;
        if (role !== "OWNER") {
            return ErrorHandler("Forbidden", new Error("Only restaurant owners can delete their restaurants"), res, 403);
        }
        // Check if the restaurant exists and user is one of the owners
        const existingRestaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
        });
        if (!existingRestaurant) {
            return ErrorHandler("Restaurant not found", new Error("No Restaurant with the provided Id"), res, 404);
        }
        // Check if the user is in the owner array
        if (!existingRestaurant.owner.includes(userId)) {
            return ErrorHandler("Forbidden", new Error("You are not the owner of this restaurant"), res, 403);
        }
        // Delete the restaurant
        await prisma.restaurant.delete({
            where: { id: restaurantId },
        });
        return SuccessHandler({}, res, 200, "Restaurant deleted successfully");
    }
    catch (error) {
        return ErrorHandler("Error processing request", error, res, 500);
    }
};
export default RestaurantDeleteController;
