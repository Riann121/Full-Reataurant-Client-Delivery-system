import { Response } from 'express';
import colors from 'colors';

// CUSTOM ERROR HANDLER FOR RESPONSES
const ErrorHandler = (msg:string, err:Error,  res:Response, status:number)=>{

    // LOG ERROR MESSAGE
    console.log(colors.bgRed(`ERROR [${status}]: ${msg} - ${err.message}`));

    // SEND ERROR RESPONSE
    res.status(status).json({
            status:status,
            success:false,
            message:msg
    })
}

// CUSTOM SUCCESS HANDLER FOR RESPONSES
const SuccessHandler = (msg:string, res:Response, status:number)=>{

    // LOG SUCCESS MESSAGE
    console.log(colors.bgGreen(`SUCCESS [${status}]: ${msg}`));

    // SEND SUCCESS RESPONSE
    res.status(status).json({
            status:status,
            success:true,
            message:msg
    })              
}

export { ErrorHandler, SuccessHandler };