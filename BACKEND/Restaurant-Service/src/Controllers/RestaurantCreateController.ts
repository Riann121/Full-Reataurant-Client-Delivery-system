import { Response, Request } from "express";
import { ErrorHandler } from "../Utils/customErrorHandler.js";
import { SuccessHandler } from "../Utils/customSuccessHandler.js";
import { prisma } from "../Config/prisma.js";

const RestaurantCreateController = async (req: Request, res: Response) => {
  try {
    const { name, address } = req.body;
    const auth = req.body.auth;

    // VALIDATE REQUIRED FIELDS
    if (!name || !address) {
      return ErrorHandler("Missing required fields", new Error("Name and address are required"), res, 400);
    }

    if (!auth || !auth.userId) {
      return ErrorHandler("Unauthorized", new Error("User authentication required"), res, 401);
    }

    const userId = auth.userId;

    // CREATE RESTAURANT
    try {
      const restaurant = await prisma.restaurant.create({
        data: {
          name,
          address,
          owner: userId
        },
      });

      return SuccessHandler(restaurant, res, 201, "Restaurant created successfully");
    } catch (error) {
      return ErrorHandler("Error creating restaurant", error as Error, res, 500);
    }
  } catch (error) {
    return ErrorHandler("Error processing request", error as Error, res, 500);
  }
};

export default RestaurantCreateController;
