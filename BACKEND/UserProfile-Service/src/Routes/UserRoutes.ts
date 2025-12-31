import { Router } from "express";
import createUserController from "../Controllers/UserCreateController.js";

const clientRouter = Router();

//USER CREATION ROUTE
clientRouter.post('/create', createUserController);




export { clientRouter };