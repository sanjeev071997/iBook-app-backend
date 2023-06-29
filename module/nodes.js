import mongoose from "mongoose";

const NodesSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true, 
    },

    title: {
        type: String,
        required: true,
    },

    description: {
        type:String,
        required: true,
    },

    status: { 
        type: Boolean, 
        default: true, 
    },

},
    { timestamps: true }
);


const nodes = mongoose.model("node", NodesSchema);
export default nodes;