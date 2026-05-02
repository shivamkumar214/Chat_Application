import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";

//create Express app and HTTP server
const app = express();
const server = http.createServer(app)

// Middleware setup
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());


//connect to MongoDB
import {connectDB} from "./lib/db.js";
connectDB();


// Routes setup
app.use("/api/status", (req, res) => res.send("Server is live"));

import userRouter from "./routes/userRoutes.js";
app.use("/api/auth", userRouter)

import messageRouter from "./routes/messageRoutes.js";
app.use("/api/messages", messageRouter);


// import { Socket } from "socket.io"
import {Server} from "socket.io";

// Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

// Store online users
export const userSocketMap = {}; //{userId: socketId}

//socket.io connection handler
io.on("connection", (socket)=> {
    const userId = socket.handshake.query.userId;
    
    if(userId){
        console.log("User connected");
        userSocketMap[userId]=socket.id
    }   

    //Emit online users to all connected clients.
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=> {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => 
    console.log("Server is running on PORT: " + PORT)
);