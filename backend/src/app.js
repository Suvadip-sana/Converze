import dotenv from "dotenv"; // ✅ ES Modules syntax
if (process.env.NODE_ENV !== "production") {
  dotenv.config(); // Load .env file
}
import express from "express";
import mongoose from "mongoose";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { connectToSocket } from "./controllers/socket.manager.js";
import userRoutes from "./routes/user.routes.js";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();
const port = process.env.PORT || 7000;
const dburl = process.env.DB_URL;

const app = express();
const server = createServer(app); // The ocket server and the express instance is different, So here might be something to conect both, So here comes 'createServer'
const io = connectToSocket(server);

app.use(
  cors({
    origin: "https://converze.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React/Vue build folder
app.use(express.static(path.join(__dirname, "../frontend/build")));
console.log("Resolved build path:", path.join(__dirname, "../frontend/build"));

// app.use("/api/v1/users", userRoutes); // Append the user route in main server.
app.use("/api/v2/users", userRoutes); // Append the user route in main server.

// Catch-all route to serve index.html for client-side routes
app.get("*", (req, res) => {
  //   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));

  const indexPath = path.join(__dirname, "../frontend/build", "index.html");
  console.log("Checking index.html at:", indexPath);

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error("index.html MISSING at:", indexPath);
    res.status(500).send("Frontend build missing!");
  }
});

async function connectMong() {
  await mongoose.connect(dburl);
}

connectMong()
  .then(() => console.log("Connection successfull!"))
  .catch((err) => console.log("Faild to connect with DB, error: ", err));

server.listen(port, () => {
  console.log("Server listening on port: ", port);
});
