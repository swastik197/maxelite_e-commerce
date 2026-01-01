import mongoose from 'mongoose';
export async function connectDB(url){
    await mongoose.connect(url)
    .then('db connected')
    .catch('unable to connect with database')
}