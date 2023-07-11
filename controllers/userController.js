import User from "../module/user.js";
import Contact from "../module/contact.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
// dotenv config
dotenv.config();

const config = new Configuration({
    apiKey: process.env.CHATGPT_API_KEY
});

const openai = new OpenAIApi(config);

// Register Controller
export const registerController = async (req, res) => {
    try {
        if (req.body.username == "", req.body.email == "", req.body.password == "") {
            return res.status(200).send({
                message: "All Field Required",
                success: false
            });
        }
        const existUser = await User.findOne({ email: req.body.email });
        if (existUser) {
            return res.status(200).send({
                message: "User Already Exist",
                success: false
            });
        }
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
        const newUser = new User(req.body);
        await newUser.save();
        const user = await User.findOne({ email: req.body.email });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        user.token = token
        await user.save();
        res.status(201).send({
            message: "Register Successfully",
            success: true,
            token,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Register Controller Error'
        })
    }
};

// Login Controller
export const loginController = async (req, res) => {
    if (req.body.email == "", req.body.password == "") {
        return res.status(200).send({
            message: "All Field Required",
            success: false
        });
    }
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({
                message: 'Invalid username or password',
                success: false
            });
        };
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(200).send({
                message: 'Invalid username or password'
            })
        };
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.status(200).send({
            message: 'Login Successfully',
            success: true,
            token
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Login Controller Error'
        })
    }
};

// Auth Controller
export const authController = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        user.password = undefined;
        if (!user) {
            return res.status(200).send({
                message: 'User Not Found',
                success: false,
            });
        } else {
            res.status(200).send({
                success: true,
                data: user,
            });
        }
    } catch (error) {
        res.status(500).send({
            message: 'Auth Error',
            success: false,
            error
        })
    }
};

// logout Controller
export const logoutController = async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });
        res.status(200).send({
            message: 'Logout Success',
            success: true,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Logout Controller Error'
        })
    }
};

// Update Profile Controller
export const updateProfileController = async (req, res) => {
    try {
        const updateProfile = {
            username: req.body.username,
            email: req.body.email,
        }
        const profile = await User.findByIdAndUpdate(req.params.id, updateProfile, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        res.status(200).send({
            success: true,
            message: 'Updated Your Profile',
            data: profile,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while updated profile'
        })
    }
};

// Contact Controller
export const contactController = async (req, res) => {
    if (req.body.name == "", req.body.email == "", req.body.subject == "", req.body.newMessage == "") {
        return res.status(200).send({
            message: "All Field Required",
            success: false
        })
    }
    try {
        const { name, email, subject, newMessage, userName, userEmail } = req.body
        const createNewMsg = await Contact.create({
            name,
            email,
            subject,
            newMessage,
            userName,
            userEmail,
        })
        // send the user email address.
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });
        transporter.sendMail({
            from: email,
            to: process.env.MAIL_SENDER,
            subject: `New message from ${subject}`,
            html: `<!DOCTYPE html>
            <html lang="en" >
            <head>
            <meta charset="UTF-8">
            <title> iBook App - Contact </title>
            </head>
            <body>
            <p>Hello <b>iBook App Team</b>,</p>
            <p>You got a new message from <b>${name}</b>:</p>
            <p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;">Contact for user email:-  ${email}</p>
            <p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;"> ${newMessage} </p>
            <p>Best wishes,<br>iBook App Team</p>
            <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;color:#aaa;font-size:0.8em;line-height:1;font-weight:400; overflow:hidden;">
                <p>iBook App Inc</p>
                <p>03 Udaipurwati, jhunjhunu</p>
                <p>India</p>
            </div></body></html>`,
        })
        res.status(200).send({
            success: true,
            data: createNewMsg,
            message: 'Thank you for your response',
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Server error please try again later'
        });
    }
};

// Change Password Controller
export const changePasswordController = async (req, res) => {
    if (req.body.oldPassword == "", req.body.newPassword == "", req.body.confirmPassword == "") {
        return res.status(200).send({
            message: "All Field Required",
            success: false
        });
    }
    try {
        const user = await User.findById(req.params.id);
        const password = user.password
        const isPasswordMatched = await bcrypt.compare(req.body.oldPassword, password);
        if (!isPasswordMatched) {
            return res.status(200).send({ success: false, message: 'Old password is incorrect' });
        };

        if (req.body.newPassword !== req.body.confirmPassword) {
            return res.status(200).send({ success: false, message: 'Password does not match' });
        };
        const savePassword = req.body.newPassword;
        const hashedPassword = await bcrypt.hash(savePassword, 10);
        req.body.newPassword = hashedPassword;
        user.password = req.body.newPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Your password updated successfully',
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while change password'
        })
    }
};

// Forgot Password Controller
export const forgotPasswordController = async (req, res) => {
    if (req.body.email == "") {
        return res.status(200).send({
            message: "Email Field Required",
            success: false
        });
    }
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ success: false, message: 'User not found' })
        }
        const resetToken = crypto.randomBytes(40).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 300 * 1000;
        await user.save({ validateBeforeSave: false });
        const resetPasswordUrl = `${process.env.URL}/reset-password/${resetToken}`;
        try {
            // send the user email address.
            const transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                service: process.env.MAIL_SERVICE,
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD,
                },
            });
            transporter.sendMail({
                from: process.env.MAIL_SENDER,
                to: req.body.email,
                subject: "New message from Password Recovery",
                html: `<!DOCTYPE html>
                <html lang="en" >
                <head>
                <meta charset="UTF-8">
                <title>iBook App - Password Recovery </title>
                </head>
                <body>
                <div style="font-family: Helvetica,Arial,sans-serif;overflow:hidden;line-height:2">
                    <div style="width:100%;">
                    <p style="font-size:1.1em">Hi, <b>${user.username}</b> </p>
                    <p>You got a new message from <b>iBook App</b>:</p>
                    <p>Thank you for choosing iBook App. Use the following link to complete your Password Recovery Procedure. Link is valid for 5 minutes</p>
                    <p style="background: #00466a;margin: 0 auto;font-weight: bold; width: max-content;padding: 0 10px;color: #fff;border-radius: 4px; cursor:pointer;"><a style="text-decoration: none; font-weight: bold; color:#fff"; href=${resetPasswordUrl}>Click Here</a></p>
                    <p>Note: For your privacy and protection, Please do not forward this email to anyone. </p>
                    <p>If you have not requested this email then, please ignore it.</p>
                    <p>Thank You!</p>
                    <p style="font-size:0.9em;">Best wishes,<br />iBook App Team </p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;color:#aaa;font-size:0.8em;line-height:1;font-weight:400; overflow:hidden;">
                    <p>iBook App Inc</p>
                    <p>03 Udaipurwati, jhunjhunu</p>
                    <p>India</p>
                    </div></div></div>
                    </body></html>`,
            })
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            res.status(200).send({ success: false, message: 'Server error please try again later' })
        };

        res.status(200).send({
            success: true,
            message: `Please check your email - ${req.body.email}`,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Error while forgot password'
        })
    }
};

// Reset Password Controller
export const resetPasswordController = async (req, res) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(200).send({ success: false, message: 'Reset Password Token is invalid or has been expired' })
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(200).send({ success: false, message: 'Password does not match' });
        };

        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;

        user.password = hashedPassword
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).send({
            success: true,
            message: 'Your password is reset successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Reset password in error'
        })
    }
};

// Send Email Controller
export const sendEmailController = async (req, res) => {
    if (req.body.name == "", req.body.email == "", req.body.subject == "", req.body.newMessage == "") {
        return res.status(200).send({
            message: "All Field Required",
            success: false
        })
    }
    try {
        const { name, email, subject, newMessage, } = req.body
        // send the user email address.
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            service: process.env.MAIL_SERVICE,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });
        transporter.sendMail({
            from: process.env.MAIL_SENDER,
            to: email,
            subject: `New message from ${subject}`,
            html: `<!DOCTYPE html>
                <html lang="en" >
                <head>
                <meta charset="UTF-8">
                <title> iBook App - Contact </title>
                </head>
                <body>
                <div style="font-family: Helvetica,Arial,sans-serif;overflow:hidden;line-height:2">
                    <div style="width:100%;">
                    <p style="font-size:1.1em">Hi, <b>${name}</b> </p>
                    <p>You got a new message from <b>iBook App</b>:</p>
                    <p>${newMessage}</p>
                    <p>Thank You!</p>
                    <p style="font-size:0.9em;">Best wishes,<br />iBook App Team </p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;color:#aaa;font-size:0.8em;line-height:1;font-weight:400; overflow:hidden;">
                    <p>iBook App Inc</p>
                    <p>03 Udaipurwati, jhunjhunu</p>
                    <p>India</p>
                    </div></div></div>
                </body></html>`,

        })
        res.status(200).send({
            success: true,
            message: 'Your email is successfully send',

        })
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: 'Server error please try again later'
        });
    }
};

export const ChatGptController = async (req, res) => {
    const { prompt } = req.body;
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        max_tokens: 1000,
        temperature: 0,
        prompt: prompt,

    });
    res.send(completion.data.choices[0].text)
}
