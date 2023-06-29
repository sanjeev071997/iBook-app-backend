import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },

    priority: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    complete: { 
        type: Boolean, 
        default: true, 
    },
},
    { timestamps: true }
);


const post = mongoose.model("post", PostSchema);
export default post;