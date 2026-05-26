import { Request, Response } from "express";
import { ErrorHandler } from "../../Utils/customErrorHandler.js";
import { SuccessHandler } from "../../Utils/customSuccessHandler.js";
import { prisma } from "../../Config/prisma.js";

const MenuDeleteController = async (req: Request, res: Response) => {
  try {
    const menuId = req.params.id as string;
    const parsedMenuId = parseInt(menuId);

    // VALIDATE ID
    if (isNaN(parsedMenuId)) {
      return ErrorHandler("Invalid menu ID", new Error("Menu Id is not a valid number"), res, 400);
    }

    // DELETE MENU
    try {
      await prisma.menu.delete({
        where: {
          id: parsedMenuId,
        },
      });
      return SuccessHandler(null, res, 200, "Menu deleted successfully");
    } catch (error) {
      return ErrorHandler("Error deleting menu", error as Error, res, 500);
    }
  } catch (error) {
    return ErrorHandler("Error processing request", error as Error, res, 500);
  }
};

export default MenuDeleteController;
