import { Request, Response } from "express";
import { ErrorHandler } from "../Utils/customErrorHandler.js";
import prisma from "../Config/prisma.js";
import { SuccessHandler } from "../Utils/customSuccessHandler.js";

//USER UPDATE CONTROLLER
const UserUpdateController = async (req: Request, res: Response) => {
    try {
        //AUTHENTICATED USER PROFILE AND UPDATE DATA
        const profile = req.body.auth
        const updatedData = req.body.updateData
        if(!profile){
            //HANDLE UNAUTHORIZED ACCESS
            ErrorHandler('Unauthorized', new Error('No profile data found'), res, 401);
            return;
        }
        if(!updatedData){
            //HANDLE MISSING UPDATE DATA
            return ErrorHandler('No update data provided', new Error('Update data is required'), res, 400);
            
        }
        try {
            //UPDATE USER DATA IN DATABASE
            const updatedUser = await prisma.client.update({
                where: profile.id,
                data: updatedData
            })
            //EXCLUDE PASSHASH FROM RESPONSE
            const {passhash, ...showUser} = updatedUser
            // SEND SUCCESS RESPONSE
            return SuccessHandler(showUser, res, 200, 'User updated successfully');

        } catch (error) {
            // HANDLE UPDATE FAILURE
            ErrorHandler('User update failed', error as Error, res, 404);
        }
        
    } catch (error) {
        //HANDLE GENERAL ERROR
        ErrorHandler('Error updating user', error as Error, res, 500);
    }
}

export default UserUpdateController;