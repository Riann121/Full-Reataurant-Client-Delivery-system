import { Response } from 'express';
import colors from 'colors';

// CUSTOM ERROR HANDLER FOR RESPONSES
const ErrorHandler = (msg:string, err:Error,  res:Response, status:number, serviceName:string = "api-gatway")=>{

    // LOG ERROR MESSAGE
    console.log(colors.bgRed(`ERROR [${serviceName}][${status}]: ${msg} - ${err.message}`));

    // SEND ERROR RESPONSE
    res.status(status).json({
            status:status,
            success:false,
            message:msg
    })
}

export { ErrorHandler };