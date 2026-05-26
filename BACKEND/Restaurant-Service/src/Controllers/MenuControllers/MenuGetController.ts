import { Request, Response } from "express";
import { ErrorHandler } from "../../Utils/customErrorHandler.js";
import { SuccessHandler } from "../../Utils/customSuccessHandler.js";
import { prisma } from "../../Config/prisma.js";

const MenuGetController = async (req: Request, res: Response) => {
  try {
    const menuId = req.params.id as string;
    const parsedMenuId = parseInt(menuId);

    // VALIDATE ID
    if (isNaN(parsedMenuId)) {
      return ErrorHandler("Invalid menu ID", new Error("Menu Id is not a valid number"), res, 400);
    }

    // GET MENU
    try {
      const menu = await prisma.menu.findUnique({
        where: {
          id: parsedMenuId,
        },
      });
      return SuccessHandler(menu, res, 200, "Menu retrieved successfully");
    } catch (error) {
      return ErrorHandler("Error retrieving menu", error as Error, res, 500);
    }
  } catch (error) {
    return ErrorHandler("Error processing request", error as Error, res, 500);
  }
};

export default MenuGetController;
