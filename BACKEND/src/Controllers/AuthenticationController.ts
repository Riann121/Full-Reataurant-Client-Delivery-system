import { Request, Response } from 'express';
import colors from 'colors';
import prisma from '../Config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import verify_n_jwtProvide from '../Utils/verify-n-jwt.js';

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
                    console.error('Error hashing password:', err);
                    console.log(colors.bgMagenta("custom error message here"));
                    return res.status(500).json({ message: 'Internal server error' });
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
                        console.error('Error creating user:', error);
                        console.log(colors.bgMagenta("custom error message here"));
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                }
        })
    } catch (error) {
        //HANDLE GENERAL ERROR
        console.error('Registration error:', error);
        console.log(colors.bgMagenta("custom error message here"));
        res.status(500).json({ message: 'Internal server error' });
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
        console.error('Login error:', error);
        console.log(colors.bgMagenta("custom error message here"));
        res.status(500).json({ message: 'Internal server error' });
    }
}
export { registrationController, loginController };