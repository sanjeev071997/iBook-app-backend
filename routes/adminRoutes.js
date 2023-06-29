import express from 'express';
import authMiddleware from '../middleware/userMiddleware.js'
import {searchController, deleteController, allDataController} from '../controllers/adminController.js'

const router = express.Router();

router.delete('/:id', authMiddleware, deleteController);
router.get('/search/:key',  authMiddleware, searchController);
router.get('/all/data',  authMiddleware, allDataController);


export default router;