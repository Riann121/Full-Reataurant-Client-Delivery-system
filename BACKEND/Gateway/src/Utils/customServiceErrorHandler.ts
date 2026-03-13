import {Response} from "express";
import colors from "colors";

// CUSTOM SERVICE ERROR HANDLER FOR RESPONSES
const ServiceErrorHandler = async(serviceRes: any, res:Response)=>{

    // LOG SERVICE ERROR MESSAGE
    console.log(colors.bgRed(`ERROR [${serviceRes.config.url}][${serviceRes.status}]: ${serviceRes.info.message}`));//now working on this

    const returnData = serviceRes; 
    res.status(returnData.status).json({
            status:returnData.status,
            success:false,
            message:returnData.info.message,
        }
    )
}