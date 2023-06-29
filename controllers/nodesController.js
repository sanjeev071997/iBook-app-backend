import Nodes from '../module/nodes.js'

// Create todo
export const createNodesController = async (req, res) => {
    try {
        
        const { category, title, description, username, userId, } = req.body;
        const newNodes = await Nodes.create({
            category,
            title,
            description,
            username,
            userId,
        })
        res.status(200).send({
            success: true,
            message: 'Nodes created',
            data: newNodes,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while create nodes'
        })

    }
};

// Get all todo
export const allNodesController = async (req, res) => {
    try {
        // const Nodes = await Nodes.find({ userId: req.body.userId ,  "active": true } );
        const nodes = await Nodes.find({ userId: req.body.userId  } );
        res.status(200).send({
            success: true,
            message: 'All Nodes list',
            data:nodes
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while get all Nodes list'
        })
    }
}

// update todo
export const updateNodesController = async (req, res) => {
    try {
        const updateNodes = {
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
        }
        const newUpdateNodes = await Nodes.findByIdAndUpdate(req.params.id, updateNodes,  {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        res.status(200).send({
            success: true,
            message: 'Your Nodes Updated Successfully',
            data: newUpdateNodes,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while Updated Nodes list'
        })
    }
}

// delete Todo
export const deleteNodesController = async (req, res) => {
    try {
        const nodes = await Nodes.findByIdAndDelete({ _id: req.params.id });
        
        res.status(200).json({
            success: true,
            message: "Your Nodes Is Deleted Successfully"
        });
        
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while Nodes is deleted '
        })

    }
}

// search Todo
export const searchNodesController = async (req, res) => {
    try {
        const searchNodes = await Nodes.find({ userId: req.body.userId ,
        "$or" : [
            {title: {$regex: req.params.key, $options: 'i'}},
            {category: {$regex: req.params.key, $options: 'i'}}
        ]
    
    } ) 
    res.status(200).send({
        success: true,
        message: 'Search Nodes title',
        data: searchNodes,
    });

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error While Search Nodes'
        })

    }
}

