import express from 'express';
import authMiddleware from '../middleware/userMiddleware.js'
import {
    createTodoController,
    allTodoController,
    updateTodoController,
    completeController,
    undoController,
    deleteTodoController,
    searchTodoController
} from '../controllers/postController.js'

const router = express.Router();

// post router 
router.post('/', authMiddleware, createTodoController);

router.get('/', authMiddleware, allTodoController);

router.put('/:id', authMiddleware, updateTodoController);

router.put('/complete/:id', completeController)

router.put('/undo/:id', undoController)

router.delete('/delete/:id', authMiddleware, deleteTodoController);

router.get('/search/:key', authMiddleware, searchTodoController)

export default router;