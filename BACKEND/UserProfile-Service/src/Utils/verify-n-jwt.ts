import bcrypt from 'bcrypt';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import colors from 'colors';
import { PrismaClient } from '@prisma/client/extension';

import 'dotenv/config';
import { ErrorHandler } from './customErrorHandler.js';


const verify_n_jwtProvide = async(password:string, user:PrismaClient, res:Response)=>{
    try {
        const result  = await bcrypt.compare(password, user.passhash);
            if (result) {
                //PASSWORDS MATCHED
                res.status(200).json({ message: 'Login successful' });
                //GENERATE JWT TOKEN
                const secretKey = process.env.JWT_SECRET;
                if (!secretKey) {
                    return ErrorHandler('JWT secret key not found', new Error('Missing JWT secret'), res, 500);
                }
                //SIGNING THE TOKEN
                const token = jwt.sign(
                    { userId: user.id, role: user.role },
                    secretKey, { expiresIn: '24h' });

                res.status(200).json({ message: 'Login successful', token });
            
            } else {
                //PASSWORDS DON'T MATCH
                res.status(401).json({ message: 'Invalid credentials' });
            }
    } catch (error) {
        //HANDLE ERROR DURING AUTHENTICATION
        ErrorHandler('Error during authentication', error as Error, res, 500);
    }
}

export default verify_n_jwtProvide;