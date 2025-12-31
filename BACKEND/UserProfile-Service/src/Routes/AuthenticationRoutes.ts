import { Router } from "express";
import { registrationController, loginController } from "../Controllers/UserAuthenticationController.js";

const authRouter = Router();

//USER AUTHENTICATION ROUTES
authRouter.post('/register', registrationController);

//LOGIN ROUTE
authRouter.post('/login', loginController);

export { authRouter };