import { Router } from "express";

import UserRegistrationContorller from "../Controllers/UserRegistrationController";

const userAuthRouter = Router()

userAuthRouter.post('/client-auth',UserRegistrationContorller);

export default userAuthRouter