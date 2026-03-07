import { Server } from "socket.io";
import cors from 'cors';

let connections = {}; // To know how many are connected with this socket server
let messages = {};
let timeOnLine = {};


//--------------Example of how those objects are looks like----------------//

// connections = {
//     "room1": ["socketA", "socketB"],
//     "room2": ["socketC", "socketD"],
//     "room3": ["socketE", "socketF"]
// };



// timeOnLine = {
//     "socket123": "2024-12-31T12:00:00.000Z"
// };



// messages = {
//     "room1": [
//         { sender: "User1", data: "Hi!", "socket-id-sender": "socket1" },
//         { sender: "User2", data: "How are you?", "socket-id-sender": "socket2" }
//     ]
// };

//------------------------------------------------------------------------------//




export const connectToSocket = (server) => {
    const io = new Server(server, { // To solve the cross origin error (For production this is no need to add)
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
            
        }
    });

    // Listens for new client connections.
    io.on("connection", (socket) => {  // socket: Represents the individual connection between the client and server.

        // console.log("Something Connected!");

        socket.on("join-call", (path) => { // Listens for a client event named "join-call", triggered when a user joins a specific room (path). Path means room name,

            if(connections[path] === undefined){ // If the incomming path which is comming from the client side is not present in the connections object then create a empty array for that path to store connected socket IDs.
                connections[path] = [];
            }
            connections[path].push(socket.id); // If not then Push the socket id to the path array because there is more than one user connected with the same path.

            timeOnLine[socket.id] = new Date(); // To know when the user is connected with the server(Means when the user is online).

            for(let a = 0; a < connections[path].length; a++){
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]); // Emit the user-joined event to all the users who are connected with the same path if a new user is joind to the same room.
            }

            if(messages[path] !== undefined){
                for(let a = 0; a < messages[path].length; ++a){
                    io.to(socket.id).emit("chat-message", 
                        messages[path][a].data,
                        messages[path][a].sender, 
                        messages[path][a].userId, // We consider 'user-id' of the sender because of to detect from where the message is comming.
                        messages[path][a].timeStamp // Now rejoin user also receive time stamp
                    ); 
                }
            }


        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender, userId) =>{

            const[matchingRoom, found] = Object.entries(connections).reduce(([room, isFound], [roomKey, roomValue]) => {

                if(!isFound && roomValue.includes(socket.id)){
                    return[roomKey, true];
                }

                return[room, isFound];


            }, ['', false]);

            if(found === true){
                if(messages[matchingRoom] === undefined){
                    messages[matchingRoom] = []
                }

                const timeStamp = new Date().toISOString();

                //Add the new message to the room's message history.
                messages[matchingRoom].push({
                    sender,
                    data,
                    userId,
                    timeStamp // Add timestamp when message is created so that time can be shown with each and every tab

                }) // Here the socket id sender and the obove inside "join-call" the 'socket-id-seender' is same. This is important.

                // Broadcast the message to all users in the room. Include the socket id sender for identification
                connections[matchingRoom].forEach((element) => {
                    io.to(element).emit("chat-message", data, sender, userId, timeStamp); // emit with time stamp
                })
            }

        });

        socket.on("disconnect", () => {

            // Calculate how long the user was online.
            let diffTime = Math.abs(timeOnLine[socket.id] - new Date());

            let key;

            for(const[k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))){ // Iterate through all rooms to find where the disconnected user was. k means key, v means value
                for(let a = 0; a < v.length; a++){
                    if(v[a] === socket.id){
                        key = k;

                        // Notify all remaining users in the room that someone has left.
                        for(let a = 0; a < connections[key].length; a++){
                            io.to(connections[key][a]).emit('user-left', socket.id);
                        };

                        // Remove the disconnected user's socket.id from the room's connection list.
                        let index = connections[key].indexOf(socket.id);
                        connections[key].splice(index, 1);

                        // If no users remain in the room, delete the room entry.
                        if(connections[key].length === 0){
                            delete connections[key]
                        }
                    }
                }
            }
        });
    });

    return io;
}

