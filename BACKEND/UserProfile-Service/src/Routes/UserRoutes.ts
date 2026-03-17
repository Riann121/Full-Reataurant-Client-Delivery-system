import { Router } from "express";

import createUserController from "../Controllers/UserCreateController.js";
import UserGetController from "../Controllers/UserGetController.js";
import UserUpdateController from "../Controllers/UserUpdateController.js"; 
import FindUserController from "../Controllers/UserFindController.js";
import UserDeleteController from "../Controllers/UserDeleteController.js";
import UserGetAuthInfoController from "../Controllers/UserGetAuthInfoController.js";

const clientRouter = Router();

//USER CREATION ROUTE
clientRouter.post('/create', createUserController);

//USER GET ROUTE
clientRouter.get('/:id', UserGetController);

//USER FIND ROUTE
clientRouter.get('/find/:value/:qtype', FindUserController);

//USER GET AUTH ROUTE
clientRouter.get('/:number',UserGetAuthInfoController)

//USER UPDATE ROUTE
clientRouter.patch('/update', UserUpdateController);

//USER DELETE ROUTE
clientRouter.delete('/delete/:id', UserDeleteController);


export { clientRouter };