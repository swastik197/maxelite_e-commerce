import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    wishlist: { type: [mongoose.Schema.Types.ObjectId], ref: 'Product' },
    cart: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
    }],
    address: [{
        country: {
            type: String,
        },
        state: {
            type: String,
        },
        city: {
            type: String,
        }, street: {
            type: String,
        },
        postalCode: {
            type: String,
        }
    }],
    profilepic: {
        type: Buffer,
        required: true // This is where the actual binary data goes
    },

})
export default mongoose.models.user || mongoose.model('user', userSchema)