import jwt from 'jsonwebtoken'
import 'dotenv/config'
import crypto from 'crypto'

const RefreshTokenProvidingService = ()=> {

    const secretKey = process.env.REFREASH_SECRET!
    const refreshToken = crypto.randomUUID();
    
    if(secretKey && refreshToken){
        const token = jwt.sign(
            refreshToken,
            secretKey, { expiresIn: '24h' }
        );  
        if(token){
            return token;
        }
    }
    else{
        return {
            msg:"Error in generating Refresh Token",
        }
    }
}