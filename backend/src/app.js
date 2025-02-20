import express from "express";
import mongoose from 'mongoose';
import {createServer} from "node:http";
import {Server} from "socket.io";
import cors from 'cors';

import { connectToSocket } from "./controllers/socket.manager.js"
// import { connectToSocket } from "./backups/socket.manager.js"

import userRoutes from "./routes/user.routes.js";


const port = process.env.PORT || 7000;
const dburl = process.env.DB_URL || 'mongodb+srv://suvadipsana19:V3u3Uc3ppjXdJ1kb@cluster0.sf4zg.mongodb.net/';

const app = express();
const server = createServer(app); // The ocket server and the express instance is different, So here might be something to conect both, So here comes 'createServer'
const io = connectToSocket(server);


app.use(cors());
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

app.get("/", (req, res) => {
    res.send("Work fine!")
});

app.use("/api/v1/users", userRoutes); // Append the user route in main server.


server.listen(port, ()=> {
    console.log("Server listening on port: ", port);
});

