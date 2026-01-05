import { Response } from "express"
import colors from "colors";

const SuccessHandler = (data:any, res:Response, status:number,msg:string)=>{

    console.log(colors.bgBlue(`SUCCESS [${status}]: ${msg}`));
    res.status(status).json({
            status:status,
            success:true,
            data:data,
            info:{
                service:"user-service",
                message:msg,
                gatewayMessage:msg,
            }
    })
}