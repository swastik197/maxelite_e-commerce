import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    }, email: {
        type: String,
    }, password: {
        type: String,
    },role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
})
export default mongoose.models.user || mongoose.model('user',userSchema)