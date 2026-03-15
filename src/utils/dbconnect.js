import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(url){
    if (!url) {
        throw new Error('MONGO_URI is not configured');
    }

    if (isConnected || mongoose.connection.readyState === 1) {
        return;
    }

    try {
        await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log('db connected');
    } catch (err) {
        isConnected = false;
        console.log('unable to connect with database', err);
        throw err;
    }
}