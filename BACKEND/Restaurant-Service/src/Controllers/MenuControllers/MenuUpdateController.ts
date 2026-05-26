import { Response, Request } from "express";
import { ErrorHandler } from "../../Utils/customErrorHandler.js";
import { SuccessHandler } from "../../Utils/customSuccessHandler.js";
import { prisma } from "../../Config/prisma.js";

const MenuUpdateController = async (req: Request, res: Response) => {
  try {
    const { restaurantId, id: menuId } = req.params;
    const auth = req.body.auth;
    const { name, description, price, orders } = req.body;

    if (!restaurantId || !menuId) {
      return ErrorHandler("Missing parameters", new Error("Restaurant Id and Menu Id are required"), res, 400);
    }

    const parsedMenuId = parseInt(menuId as string);
    if (isNaN(parsedMenuId)) {
      return ErrorHandler("Invalid menu ID", new Error("Menu Id is not a valid number"), res, 400);
    }

    if (!auth || !auth.userId || !auth.role) {
      return ErrorHandler("Unauthorized", new Error("User authentication required"), res, 401);
    }

    const userId = auth.userId;
    const role = auth.role;

    if (role === "OWNER") {
      // 1. Check if the restaurant exists and user is the owner
      const existingRestaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId as string },
      });

      if (!existingRestaurant) {
        return ErrorHandler("Restaurant not found", new Error("No Restaurant with the provided Id"), res, 404);
      }

      if (!existingRestaurant.owner.includes(userId)) {
        return ErrorHandler("Forbidden", new Error("You are not the owner of this restaurant"), res, 403);
      }

      // 2. Check if the menu exists
      const existingMenu = await prisma.menu.findUnique({
        where: { id: parsedMenuId },
      });

      if (!existingMenu) {
        return ErrorHandler("Menu not found", new Error("No Menu with the provided Id"), res, 404);
      }

      // 3. Check if the menu belongs to the restaurant
      if (existingMenu.restaurantId !== restaurantId) {
        return ErrorHandler("Forbidden", new Error("This menu does not belong to the specified restaurant"), res, 403);
      }

      // 4. Update the menu
      const updatedMenu = await prisma.menu.update({
        where: {
          id: parsedMenuId,
        },
        data: {
          name: name || existingMenu.name,
          description: description || existingMenu.description,
          price: price || existingMenu.price,
          orders: orders || existingMenu.orders,
        },
      });

      return SuccessHandler(updatedMenu, res, 200, "Menu updated successfully");
    } else {
      return ErrorHandler("Forbidden", new Error("Only restaurant owners can update menus"), res, 403);
    }
  } catch (error) {
    return ErrorHandler("Error updating menu", error as Error, res, 500);
  }
};

export default MenuUpdateController;
