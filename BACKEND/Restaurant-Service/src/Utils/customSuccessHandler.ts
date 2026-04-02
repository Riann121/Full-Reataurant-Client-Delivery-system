import { Response } from "express"
import colors from "colors";

// CUSTOM SUCCESS HANDLER FOR RESPONSES
const SuccessHandler = (data:any, res:Response, status:number,msg:string)=>{

    // LOG SUCCESS MESSAGE
    console.log(colors.bgBlue(`SUCCESS [${status}]: ${msg}`));

    // SEND SUCCESS RESPONSE
    res.status(status).json({
            status:status,
            success:true,
            data:data,
            info:{
                service:"restaurant-service",
                message:msg,
                gatewayInfo:msg,//
            }
    })
}

export { SuccessHandler };