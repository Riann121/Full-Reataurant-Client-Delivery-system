import { Router } from "express";

import createUserController from "../Controllers/UserCreateController.js";
import UserGetAllController from "../Controllers/UserGetController.js";
import UserUpdateController from "../Controllers/UserUpdateController.js"; 
import FindUserController from "../Controllers/UserFindController.js";
import UserDeleteController from "../Controllers/UserDeleteController.js";

const clientRouter = Router();

//USER CREATION ROUTE
clientRouter.post('/create', createUserController);

//USER GET ALL ROUTE
clientRouter.get('/:id', UserGetAllController);

//USER FIND ROUTE
clientRouter.get('/find/:value/:qtype', FindUserController);

//USER UPDATE ROUTE
clientRouter.patch('/update', UserUpdateController);

//USER DELETE ROUTE
clientRouter.delete('/delete/:id', UserDeleteController);
export { clientRouter };