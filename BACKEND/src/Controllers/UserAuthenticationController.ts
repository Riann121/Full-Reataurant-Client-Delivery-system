import { Request, Response } from 'express';
import colors from 'colors';
import prisma from '../Config/prisma.js';
import bcrypt from 'bcrypt';
import verify_n_jwtProvide from '../Utils/verify-n-jwt.js';
import { ErrorHandler } from '../Utils/customErrorHandler.js';

//REGISTRATION CONTROLLER
const registrationController = async (req: Request, res: Response) => {
    try {
        const {name, number, password, Role} = req.body
        if (!name || !number || !password || !Role) {
            return res.status(400).json({ message: 'All fields are required' });
        }
            //PASSWORD HASHING USING BCRYPT
            const salt = 10
            bcrypt.hash (password, salt, async (err:Error | undefined, hash:string) => {
                if (err) {
                    //HANDLE HASHING ERROR
                    ErrorHandler('Error hashing password', err, res, 500);
                }   
                else {
                    try { 

                        //CREATE NEW USER AND SEND RESPONSE
                        const newUser = await prisma.client.create({
                            data: {
                                name: name,
                                number: number,
                                passhash: hash,                         
                                Role: Role                      
                            }
                        })
                        const {passhash, ...showUser} = newUser
                        res.status(201).json({ message: 'User registered successfully', showUser })

                    } catch (error) {
                        //HANDLE USER CREATION ERROR
                        ErrorHandler('Error creating user', error as Error, res, 500);
                    }
                }
        })
    } catch (error) {
        //HANDLE GENERAL ERROR
        ErrorHandler('Registration error', error as Error, res, 500);
    }
}


//LOGIN CONTROLLER
const loginController = async (req: Request, res: Response) => {
    try {
        const {number, password} = req.body;
        if(!number || !password){
            return res.status(400).json({ message: 'Number and password are required' });
        }
        const user = await prisma.client.findUnique({
            where: { number: number }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        //VERIFY PASSWORD AND GENERATE JWT
        verify_n_jwtProvide(password, user, res);

    } catch (error) {
        //HANDLE GENERAL ERROR
        ErrorHandler('Login error', error as Error, res, 500);
    }
}
export { registrationController, loginController };