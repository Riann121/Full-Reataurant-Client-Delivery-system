import { Request, Response } from "express";
import { ErrorHandler } from "../../Utils/customErrorHandler.js";
import { SuccessHandler } from "../../Utils/customSuccessHandler.js";
import { prisma } from "../../Config/prisma.js";

const MenuGetAllController = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId as string;

    // VALIDATE RESTAURANT ID
    if (!restaurantId) {
      return ErrorHandler("Missing restaurant", new Error("Restaurant Id is required"), res, 400);
    }

    // GET ALL MENUS
    try {
      const menus = await prisma.menu.findMany({
        where: {
          restaurantId: restaurantId,
        },
      });
      return SuccessHandler(menus, res, 200, "Menus fetched successfully");
    } catch (error) {
      return ErrorHandler("Error fetching menus", error as Error, res, 500);
    }
  } catch (error) {
    return ErrorHandler("Error processing request", error as Error, res, 500);
  }
};

export default MenuGetAllController;
