import { Request, Response } from "express";
import { ErrorHandler } from "../../Utils/customErrorHandler.js";
import { SuccessHandler } from "../../Utils/customSuccessHandler.js";
import { prisma } from "../../Config/prisma.js";

const MenuCreateController = async (req: Request, res: Response) => {
  try {
    const { name, description, price, restaurantId } = req.body;

    // VALIDATE REQUIRED FIELDS
    if (!name || !price || !restaurantId) {
      return ErrorHandler("Missing required fields", new Error("Name, price, and restaurantId are required"), res, 400);
    }

    // CREATE MENU
    try {
      const menu = await prisma.menu.create({
        data: {
          name,
          description,
          price,
          restaurantId,
        },
      });
      return SuccessHandler(menu, res, 201, "Menu created successfully");
    } catch (error) {
      return ErrorHandler("Error creating menu", error as Error, res, 500);
    }
  } catch (error) {
    ErrorHandler("Error processing request", error as Error, res, 500);
  }
};

export default MenuCreateController;
