import mongoose from 'mongoose';

// MongoDB connection options for robustness
const mongoOptions = {
    serverSelectionTimeoutMS: 10000,  // 10s timeout for server selection
    socketTimeoutMS: 45000,           // 45s timeout for socket operations
    connectTimeoutMS: 10000,          // 10s timeout for initial connection
    retryWrites: true,
    w: 'majority',
};

// Standard (non-SRV) connection string — bypasses DNS SRV lookup issues on Windows
// Lists all 3 replica set members so Mongoose can discover the primary for writes
const FALLBACK_URI = "mongodb://AmitKumar:amit123@ac-bbgcxjh-shard-00-00.hy25ijr.mongodb.net:27017,ac-bbgcxjh-shard-00-01.hy25ijr.mongodb.net:27017,ac-bbgcxjh-shard-00-02.hy25ijr.mongodb.net:27017/chat-app?ssl=true&authSource=admin&replicaSet=atlas-v5o9x0-shard-0";

// Function to connect to the MongoDB database
export const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log('Database Connected'));
    mongoose.connection.on('error', (err) => console.log('MongoDB connection error:', err.message));

    // Try SRV connection first
    try {
        console.log('Attempting MongoDB connection (SRV)...');
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`, mongoOptions);
        return;
    } catch (error) {
        console.log('SRV connection failed:', error.message);
        console.log('Trying standard connection string (non-SRV fallback)...');
    }

    // Fallback to standard connection string
    try {
        await mongoose.connect(FALLBACK_URI, mongoOptions);
    } catch (error) {
        console.log('Standard connection also failed:', error.message);
        console.log('\n⚠️  MongoDB connection failed. Check:');
        console.log('  1. Your IP is whitelisted in Atlas Network Access');
        console.log('  2. Your internet connection is working');
        console.log('  3. Your MongoDB credentials are correct\n');
    }
};



// import mongoose from "mongoose";

// // Function to connect MongoDB
// export const connectDB = async () => {
//     try {

//         await mongoose.connect(process.env.MONGODB_URI);

//         console.log("Database Connected");

//     } catch (error) {

//         console.log("MongoDB Connection Error:", error);

//         process.exit(1);
//     }
// };