const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/msgs');
const {userJoin, getCurrentUser, userLeave, getRoomUsers,countUsers} = require('./utils/users');
const {roomCreated, getRooms, removeCurrentRoom} = require('./utils/rooms');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const NodeRSA = require('node-rsa');



// NodeRSA
// const key = new NodeRSA({b: 528});
 
// const text = 'Hello RSA!';
// const keycode = 'hihi';
// try {
//     const encrypted = key.encrypt(text, 'base64');
//     console.log('encrypted: ', encrypted, typeof(encrypted));
//     const decrypted = key.decrypt(encrypted, 'utf8');
//     console.log('decrypted: ', decrypted);
//     console.log(key);
// } catch (error) {
//     console.log(error);
// }


// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'KryptChat Bot';

// run when a client connects
io.on('connection', socket => {
    // console.log('New WS Connection...');

    socket.on('joinRoom', ({username, room, keyword})=>{
        const key = new NodeRSA().generateKeyPair();
        const privKey = key.exportKey("private");
        const pubKey = key.exportKey("public");
        const user = userJoin(socket.id, username, room ,keyword, privKey, pubKey);
        const rooms = getRooms();
        // console.log(privKey)
        // console.log(pubKey)
        let flag=0;
        if(rooms.length!==0){
            rooms.forEach(roomOld =>{
                if(roomOld.roomName === room){
                    flag=1;
                }
            })
        }

        if(flag===0){
            roomCreated(room, keyword);
        }

        const curRoom = rooms.filter(room=> user.room === room.roomName);
        // console.log(curRoom);

        if(countUsers(curRoom)<3){
            socket.emit('encrypting', room);
            const Rooms = getRooms();
            // console.log(0);
            console.log(Rooms);
    
            socket.join(user.room);
            console.log(countUsers(curRoom))
    
            // Welcome current user
            socket.emit('message', formatMessage(botName,'Welcome to KryptChat')); // to a single user
    
            // broadcast when use connects
            socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat`)); //to every user except the client user
    
            // Send users, keyword and room info
             io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room),
                keyword: user.keyword,
             })
        }else{
            socket.emit('message', formatMessage(botName,'This room is full...')); // to a single user
        }
        
    }) 


    // Listen for user message
    socket.on('chatMessage', msg=>{
        const user = getCurrentUser(socket.id);
        
        console.log(user);
        io.to(user.room).emit('message', ()=>{
            formatMessage(user.username,msg);
        });
    })

    // broadcast when user disconnects
    socket.on('disconnect', ()=>{

        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`)); // to every user
            // Send users, keyword and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room),
                keyword: user.keyword,
            });
            if(getRoomUsers(user.room).length == 0){
                removeCurrentRoom(user.room);
            }
        }

    });
});


const PORT = 5000 || process.env.PORT;

server.listen(PORT, console.log('Server running on PORT: '+ PORT));




