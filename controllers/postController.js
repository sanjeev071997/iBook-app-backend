import Post from '../module/post.js'

// Create todo
export const createTodoController = async (req, res) => {
    try {
        const { priority, title, username, userId, } = req.body;
        const newPost = await Post.create({
            priority,
            title,
            username,
            userId,
        })
        res.status(200).send({
            success: true,
            message: 'Todo created',
            data: newPost,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while create todo'
        })

    }
};

// Get all todo
export const allTodoController = async (req, res) => {
    try {
        const post = await Post.find({ userId: req.body.userId });
        res.status(200).send({
            success: true,
            message: 'All todo list',
            data: post
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while get all todo list'
        })
    }
}

// update todo
export const updateTodoController = async (req, res) => {
    try {
        const updatePost = {
            priority: req.body.priority,
            title: req.body.title,
        }
        const newUpdatePost = await Post.findByIdAndUpdate(req.params.id, updatePost, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        res.status(200).send({
            success: true,
            message: 'Your Todo Updated Successfully',
            data: newUpdatePost,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while Updated todo list'
        })
    }
};

// Complete Controller
export const completeController = async (req, res) => {
    try {
        const completeTodo = await Post.findByIdAndUpdate({ _id: req.params.id },
            { "$set": { "complete": false } },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            },
        );
        res.status(200).send({
            success: true,
            message: 'Your Todo Is Completed',
            data: completeTodo,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while Complete todo list'
        })

    }
};

// Undo Controller
export const undoController = async (req, res) => {
    try {
        const completeTodo = await Post.findByIdAndUpdate({ _id: req.params.id },
            { "$set": { "complete": true } },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            },
        );
        res.status(200).send({
            success: true,
            message: 'Your Todo Is Undo',
            data: completeTodo,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while Complete todo list'
        })

    }
};

// delete Todo
export const deleteTodoController = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete({ _id: req.params.id });

        res.status(200).send({
            success: true,
            message: "Your Todo Is Deleted Successfully"
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while todo is deleted '
        })

    }
}

// search Todo
export const searchTodoController = async (req, res) => {
    try {
        const searchTodo = await Post.find({
            userId: req.body.userId,
            "$or": [
                { title: { $regex: req.params.key, $options: 'i' } },
                { priority: { $regex: req.params.key, $options: 'i' } }
            ]

        })
        res.status(200).send({
            success: true,
            message: 'Search todo title',
            data: searchTodo,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while Search todo'
        })

    }
}

