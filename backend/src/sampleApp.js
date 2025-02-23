import dotenv from "dotenv"; // ✅ ES Modules syntax
if (process.env.NODE_ENV !== "production") {
    dotenv.config(); // Load .env file
}
import express from "express";
import {createServer} from "node:http"; // Helsp to connect 'socket.io' and the 'express' server because this two are different server initially
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
const port = process.env.PORT || 7000;
const dburl = process.env.DB_URL;



const app = express();
const server = createServer(app); // Create instance on 'app' named server using 'createServer'
const io = new Server(server); // Now create a 'socket.io' server and attached it to the 'server' instance that created on previous line.



// Set the port for 'socket.io' server, same as port of 'app'(not used here because here not use app.listen)
app.set("port", (process.env.PORT || port));


async function connectWithMongoDB(){
    await mongoose.connect(dburl);
}

connectWithMongoDB().then(()=> {
    console.log("Connection successfull!");
}).catch((err)=> {
    console.log("Connection fail! ", err);
});


app.get("/", (req, res)=> {
    res.send("Server work well");
})



server.listen(port, () => { // Here server.listen also handel the app.listen because 'server' is wrapping Express app, it implicitly allows the app's routes and middleware to work.
    console.log("App listening on port: ", port);
});
