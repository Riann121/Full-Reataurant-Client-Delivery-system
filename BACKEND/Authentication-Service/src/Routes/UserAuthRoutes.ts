import { Router } from "express";

import UserRegistrationContorller from "../Controllers/UserRegistrationController";
import UserLoginController from "../Controllers/UserLoginController";

const userAuthRouter = Router()

userAuthRouter.post('/client-auth',UserRegistrationContorller);
userAuthRouter.post('/client-login',UserLoginController);

export default userAuthRouter