import jwt from 'jsonwebtoken'
import 'dotenv/config'
import crypto from 'crypto'
import { TokenServiceResponse } from '../Utils/tokenServiceResponse'

const RefreshTokenProvidingService = (): TokenServiceResponse => {
    const secretKey = process.env.REFREASH_SECRET
    const refreshToken = crypto.randomUUID();

    if(secretKey && refreshToken){
        const token = jwt.sign(
            refreshToken,
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
        "msg":"Error in generating Refresh Token",
    }
}
export default RefreshTokenProvidingService