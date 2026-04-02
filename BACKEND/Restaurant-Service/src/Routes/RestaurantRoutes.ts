import { Router } from "express";
import RestaurantCreateController from "../Controllers/RestaurantCreateController.js";
import RestaurantDeleteController from "../Controllers/RestaurantDeleteController.js";
import RestaurantGetController from "../Controllers/RestaurantGetController.js";
import RestaurantGetAllController from "../Controllers/RestaurantGetAllController.js";
import RestaurantUpdateController from "../Controllers/RestaurantUpdateController.js";

const router = Router();

// RESTAURANT ROUTES
router.post("/create", RestaurantCreateController);
router.delete("/delete/:id", RestaurantDeleteController);
router.get("/get/:id", RestaurantGetController);
router.get("/get-all", RestaurantGetAllController);
router.put("/update/:id", RestaurantUpdateController);

export default router;