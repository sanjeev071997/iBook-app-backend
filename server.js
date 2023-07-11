import express from "express";
import connectDB from './config/db.js'
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
const PORT =  8080;
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postsRoutes.js';
import nodesRoutes from './routes/nodesRoutes.js';
import adminRoutes from './routes/adminRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`);
    process.exit(1);
});

// dotenv config
dotenv.config();

// mongodb connection
connectDB();

// rest object
const app = express();

// middleware's
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({useCredentials: true} ));
app.use(cookieParser());

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

// routes
app.get('/', (req, res) => {
    res.send('Welcome To iBook-App Server')
});

app.use('/api/v1/user/', userRoutes);
app.use('/api/v1/post/', postRoutes);
app.use('/api/v1/nodes/',nodesRoutes);
app.use('/api/v1/admin/', adminRoutes)

// // static files
// app.use(express.static(path.join(__dirname,  './client/build')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, './client/build/index.html'))
// });


const server = app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

// Unhandled promise rejection for database
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to technical issue`)
    server.close(() => {
        process.exit(1);
    });
});