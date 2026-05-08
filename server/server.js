import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import {connectDB} from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from './routes/messageRoutes.js';
import { Server } from "socket.io";

// create Express app and HTTP server
const app = express();
const server = http.createServer(app);

//Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})
//Store online users
export const userSocketMap = {};

//Socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User conneted", userId);
    
    if(userId) userSocketMap[userId] = socket.id;

    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })

})

//Middleware setup
app.use(cors());
app.use(express.json({limit: "4mb"}));

//Routes setup
app.use("/api/status",(req,res)=> res.send("Server is running"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

//Connect to DataBase
try {
    await connectDB();
} catch (error) {
    console.log('Failed to connect to database:', error.message);
    console.log('Server will start without database connection.');
}

if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 5000;
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`\n⚠️  Port ${PORT} is already in use!`);
            console.log(`Run: taskkill /F /PID $(netstat -ano | findstr :${PORT})`);
            console.log('Or change PORT in your .env file.\n');
        }
    });
    server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
}

//Eport server fpr Vercel
export default server;








// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";

// import { connectDB } from "./lib/db.js";
// import userRouter from "./routes/userRoutes.js";
// import messageRouter from "./routes/messageRoutes.js";

// // Create Express app
// const app = express();

// // Create HTTP server
// const server = http.createServer(app);

// // Initialize socket.io
// export const io = new Server(server, {
//     cors: {
//         origin: "*",
//     },
// });

// // Store online users
// export const userSocketMap = {};

// // Socket connection
// io.on("connection", (socket) => {

//     const userId = socket.handshake.query.userId;

//     console.log("User Connected:", userId);

//     if (userId) {
//         userSocketMap[userId] = socket.id;
//     }

//     // Send online users
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));

//     socket.on("disconnect", () => {

//         console.log("User Disconnected:", userId);

//         delete userSocketMap[userId];

//         io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     });
// });

// // Middleware
// app.use(cors());

// app.use(express.json({
//     limit: "4mb",
// }));

// // Routes
// app.get("/api/status", (req, res) => {
//     res.send("Server is running");
// });

// app.use("/api/auth", userRouter);
// app.use("/api/messages", messageRouter);

// // Connect Database
// await connectDB();

// // Start Server
// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//     console.log(`Server running on PORT ${PORT}`);
// });

// export default server;