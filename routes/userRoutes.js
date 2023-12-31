import express from 'express';
import authMiddleware from '../middleware/userMiddleware.js'
import {
    loginController,
    registerController,
    logoutController,
    updateProfileController,
    authController,
    changePasswordController,
    forgotPasswordController,
    resetPasswordController,
    contactController,
    sendEmailController,
    ChatGptController,
} from '../controllers/userController.js'


const router = express.Router();

// user router
router.post('/login', loginController);
router.post('/register', registerController);
router.get('/logout', logoutController);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password/:token', resetPasswordController);

// auth
router.put('/:id', authMiddleware, updateProfileController);
router.post('/getUserData', authMiddleware, authController)
router.post('/contact', authMiddleware, contactController);
router.post('/send-email', authMiddleware, sendEmailController);
router.put('/change-password/:id', authMiddleware, changePasswordController);
router.post('/chatgpt', ChatGptController);


export default router;