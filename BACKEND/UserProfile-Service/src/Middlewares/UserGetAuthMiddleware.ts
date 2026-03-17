
import { Response, Request, NextFunction } from "express";
import 'dotenv/config'
import { ErrorHandler } from "../Utils/customErrorHandler.js";

const UserGetAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // GET API KEY FROM REQUEST HEADER
        const key = req.headers["x-api-key"];

        // GET SECRET KEY FROM ENVIRONMENT VARIABLE
        const secret = process.env.AUTH_SECRET;

        // CHECK IF API KEY EXISTS
        if (!key) {
            return ErrorHandler(
                "API KEY MISSING",
                new Error("NO API KEY PROVIDED"),
                res,
                401
            );
        }

        // VERIFY API KEY WITH SECRET
        if (key === secret) {

            // MARK REQUEST AS COMING FROM AUTH SERVICE
            req.body.isFromAuth = true;

            // PASS CONTROL TO NEXT MIDDLEWARE OR CONTROLLER
            return next();
        }

        // HANDLE INVALID API KEY
        return ErrorHandler(
            "UNAUTHORIZED REQUEST",
            new Error("INVALID API KEY"),
            res,
            403
        );

    } catch (error: any) {

        // HANDLE UNEXPECTED SERVER ERROR
        return ErrorHandler(
            "MIDDLEWARE AUTHENTICATION FAILED",
            error,
            res,
            500
        );
    }
};

export default UserGetAuthMiddleware;

