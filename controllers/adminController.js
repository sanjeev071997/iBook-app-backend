import User from "../module/user.js";
import Post from '../module/post.js';
import Node from '../module/nodes.js'
import Contact from "../module/contact.js";

// All Data Controller
export const allDataController = async(req, res) => {
    try {
        const users = await User.find({});
        const contact = await Contact.find({});
        const post = await Post.find({});
        const node = await Node.find({});
        res.status(200).send({
            success:true,
            message: "All data fetch",
            user:users,
            contact:contact,
            todo:post,
            node:node,
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:'Server error please try again later'
        })
        
    }
};


// Search Controller
export const searchController = async (req, res) => {
    try {
        const search = await User.find({ 
        "$or" : [
            {username: {$regex: req.params.key, $options: 'i'}},
            {email: {$regex: req.params.key, $options: 'i'}},
        ]
    
    } ) 
    res.status(200).send({
        success: true,
        message: 'Search users title',
        data: search,
    });

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while Search Users'
        })

    }
};

// Delete Controller
export const deleteController = async(req, res) => {
    try {
        const users = await User.findByIdAndDelete({ _id: req.params.id });
        
        res.status(200).json({
            success: true,
            message: "Your User Is Deleted Successfully"
        });
        
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while users is deleted'
        })

    }
};

