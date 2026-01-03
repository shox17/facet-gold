import dotenv from 'dotenv';
dotenv.config(); 
import mongoose from 'mongoose';
import app from './app';

// Connect to MongoDB and start the server (TCP)
mongoose
    .connect(process.env.MONGO_URL as string, {})
    .then((data) => {
        console.log("MongoDB connected successfully");
        const PORT =  process.env.PORT ?? 3004;
        app.listen(PORT, () => {
            console.info(`Server is running on port: ${PORT}`);
            console.info(`Admin project on http://localhost:${PORT}/admin \n`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });