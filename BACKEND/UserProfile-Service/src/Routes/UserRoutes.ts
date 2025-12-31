import { Router } from "express";

import createUserController from "../Controllers/UserCreateController.js";
import UserGetController from "../Controllers/UserGetController.js";

const clientRouter = Router();

//USER CREATION ROUTE
clientRouter.post('/create', createUserController);

//USER GET ROUTE
clientRouter.get('/:id', UserGetController);



export { clientRouter };