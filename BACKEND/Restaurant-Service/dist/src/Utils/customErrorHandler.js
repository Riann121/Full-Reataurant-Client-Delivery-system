import colors from 'colors';
// CUSTOM ERROR HANDLER FOR RESPONSES
const ErrorHandler = (msg, err, res, status) => {
    // LOG ERROR MESSAGE
    console.log(colors.bgRed(`ERROR [${status}]: ${msg} - ${err.message}`));
    // SEND ERROR RESPONSE
    res.status(status).json({
        status: status,
        success: false,
        info: {
            service: "restaurant-service",
            message: msg,
            gatewayInfo: err,
        }
    });
};
export { ErrorHandler };
