import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    token:String,
    
    resetPasswordToken: String,
    
    resetPasswordExpire: Date,

},
    { timestamps: true }
);


const User = mongoose.model("User", UserSchema);
export default User;