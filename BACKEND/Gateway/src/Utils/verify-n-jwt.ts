import bcrypt from 'bcrypt';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client/extension';

import 'dotenv/config';
import { ErrorHandler } from './customErrorHandler.js';


const verify_n_jwtProvide = async(password:string, user:PrismaClient, res:Response)=>{
    try {
        const result  = await bcrypt.compare(password, user.passhash);
            if (result) {
                //GENERATE JWT TOKEN
                const secretKey = process.env.JWT_SECRET;

                //JWT PAYLOAD
                const payload = {
                    userId: user.id,
                    role: user.role
                }

                if (!secretKey) {
                    return ErrorHandler('JWT secret key not found', new Error('Missing JWT secret'), res, 500);
                }

                //jwt SIGNATURE
                const token = jwt.sign( payload,secretKey,{algorithm:'HS256', expiresIn: '24h' });
                
                //REFRESH TOKEN 
                const refreshToken = crypto.randomUUID();

                //STORE REFRESH TOKEN IN DB
                //***WILL BE ADDED LATER***

                //SET REFRESH TOKEN AS HTTP-ONLY COOKIE
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });

                //SEND RESPONSE WITH JWT TOKEN
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
