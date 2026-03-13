import jwt from 'jsonwebtoken'
import 'dotenv/config'


const SessionTokenProvidingService = (credentials) => {
    //GENERATE JWT TOKEN
    const secretKey = process.env.JWT_SECRET!

    if(credentials && secretKey){
        const token = jwt.sign(
            { userId: credentials.id, role: credentials.role },
            secretKey, { expiresIn: '24h' }
        );  
        if(token){
            return token;
        }
    }
    else{
        return {
            msg:"JWT token credentials or scretkey are not provided",
        }
    }
}