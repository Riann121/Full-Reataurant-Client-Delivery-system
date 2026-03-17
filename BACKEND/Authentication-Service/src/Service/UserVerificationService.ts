import bcrypt from "bcrypt"

const UserVerification = async(passhash:string, password:string)=>{
    const verification = await bcrypt.compare(password,passhash)
    return verification
}

export default UserVerification