import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const connectDB = () => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Database connected successfully');
}

export default connectDB