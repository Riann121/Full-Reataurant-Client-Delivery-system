import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../Utils/customErrorHandler.js';

// AUTHENTICATION MIDDLEWARE
const AuthenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // EXTRACT TOKEN FROM AUTHORIZATION HEADER
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return ErrorHandler('No token provided', new Error('Token missing'), res, 401);
        }
        
        // IF NO TOKEN, RETURN UNAUTHORIZED
        jwt.verify(token as string, process.env.JWT_SECRET as string, (err, decoded) => {
            if (err) {

                // INVALID TOKEN
                return ErrorHandler('Unauthorized access', err as Error, res, 401);
            }
            // TOKEN IS VALID
            const payload = decoded as jwt.JwtPayload;

                    // ATTACH DECODED PAYLOAD TO REQUEST OBJECT
                    if (!req.body) req.body = {};
                    req.body.auth = payload;
                    next()
        });
    } catch (error) {
        // HANDLE GENERAL ERROR
        ErrorHandler('Authentication error', error as Error, res, 500);
    }
}
export { AuthenticationMiddleware };