import express from 'express';
import authMiddleware from '../middleware/userMiddleware.js'

import {createNodesController, allNodesController, updateNodesController, deleteNodesController, searchNodesController } from '../controllers/nodesController.js'

const router = express.Router();

// post router 
router.post('/',authMiddleware, createNodesController);

router.get('/', authMiddleware, allNodesController);

router.put('/:id', authMiddleware, updateNodesController);

router.delete('/delete/:id',authMiddleware, deleteNodesController);

router.get('/search/:key',authMiddleware, searchNodesController)

export default router;