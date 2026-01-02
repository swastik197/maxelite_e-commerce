import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const key = process.env.key
function setUser(newuser) {
    return jwt.sign({
        id: newuser.id,
        name: newuser.name,
        email: newuser.email,
        role: newuser.role
    },key)
}
function getUser(token){
    if(!token){return null}
    try{
        return jwt.verify(token,key)
    }catch(err){
        console.log('error while verifying the jwt token',err)
        return null
    }
}
export {setUser,getUser}