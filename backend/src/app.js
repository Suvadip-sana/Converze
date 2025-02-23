import dotenv from "dotenv"; // ✅ ES Modules syntax
if (process.env.NODE_ENV !== "production") {
    dotenv.config(); // Load .env file
}
import express from "express";
import mongoose from 'mongoose';
import {createServer} from "node:http";
import {Server} from "socket.io";
import cors from 'cors';
import { connectToSocket } from "./controllers/socket.manager.js"
import userRoutes from "./routes/user.routes.js";


const port = process.env.PORT || 7000;
const dburl = process.env.DB_URL

const app = express();
const server = createServer(app); // The ocket server and the express instance is different, So here might be something to conect both, So here comes 'createServer'
const io = connectToSocket(server);


app.use(cors({
    origin: 'https://converze.onrender.com',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

async function connectMong(){
    await mongoose.connect(dburl);
};

connectMong().then(()=> {
    console.log("Connection successfull!");
}).catch((err) => {
    console.log("Faild to connect with DB, error: ", err);
});

// app.use("/api/v1/users", userRoutes); // Append the user route in main server.
app.use("/api/v2/users", userRoutes); // Append the user route in main server.

server.listen(port, ()=> {
    console.log("Server listening on port: ", port);
});

