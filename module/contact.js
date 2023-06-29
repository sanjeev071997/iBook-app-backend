import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    subject: {
        type: String,
        required: true,
    },

    newMessage: {
        type: String,
        required: true,
    },

    userName: {
        type: String,
        required: true,
    },

    userEmail: {
        type: String,
        required: true,
    },

},
    { timestamps: true }
);


const Contact = mongoose.model("Contact", ContactSchema);
export default Contact;