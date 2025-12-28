import bcrypt from 'bcrypt';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import colors from 'colors';
import 'dotenv/config';

const verify_n_jwtProvide = async(password:string, user:any, res:Response)=>{
    try {
        const result  = await bcrypt.compare(password, user.passhash);
            if (result) {
                //PASSWORDS MATCHED
                res.status(200).json({ message: 'Login successful' });
                //GENERATE JWT TOKEN
                const secretKey = process.env.JWT_SECRET;
                if (!secretKey) {
                    console.error('JWT secret key is not defined in environment variables');
                    console.log(colors.bgMagenta("custom error message here"));
                    return res.status(500).json({ message: 'Internal server error' });
                }
                //SIGNING THE TOKEN
                const token = jwt.sign(
                    { userId: user.id, role: user.Role },
                    secretKey, { expiresIn: '24h' });

                res.status(200).json({ message: 'Login successful', token });
            
            } else {
                //PASSWORDS DON'T MATCH
                res.status(401).json({ message: 'Invalid credentials' });
            }
    } catch (error) {
        //HANDLE ERROR DURING AUTHENTICATION
        console.error('Error during authentication:', error);
        console.log(colors.bgMagenta("custom error message here"));
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default verify_n_jwtProvide;