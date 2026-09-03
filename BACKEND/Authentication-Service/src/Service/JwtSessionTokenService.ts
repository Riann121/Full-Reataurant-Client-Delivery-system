import jwt from 'jsonwebtoken'
import 'dotenv/config'
import customUserData from '../Utils/customUserData'
import { TokenServiceResponse } from '../Utils/tokenServiceResponse'

const SessionTokenProvidingService = (credentials:customUserData): TokenServiceResponse => {
    const secretKey = process.env.JWT_SECRET

    if(credentials && secretKey){
        const token = jwt.sign(
            { userId: credentials.id, role: credentials.role },
            secretKey, { expiresIn: '24h' }
        );
        if(token){
            return {
                "stat":"success",
                "token":token,
            }
        }
    }
    return {
        "stat":"fail",
        "msg":"Error in generating Session Token",
    }
}

export default SessionTokenProvidingService 