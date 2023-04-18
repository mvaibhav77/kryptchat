const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/msgs');
const {userJoin, getCurrentUser, userLeave, getRoomUsers,countUsers, users} = require('./utils/users');
const {roomCreated, getRooms, removeCurrentRoom} = require('./utils/rooms');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const NodeRSA = require('node-rsa');
const e = require('express');


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
            const Rooms = getRooms();
            // console.log(0);
            console.log(Rooms);
    
            socket.join(user.room);
            console.log(countUsers(curRoom))
            socket.emit('encrypting', {room: curRoom,user: user});
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
    socket.on('chatMessage', (args)=>{
        console.log('hello', args.msg)
        const from = getCurrentUser(socket.id);
        const to = users.filter(user=> {
            return user.room === from.room && user.id !== socket.id;
        });
        console.log(to[0]);
        socket.broadcast.to(from.room).emit('message', encryptFormat(to[0], from, args.msg));
        socket.emit('message', formatMessage(from.username,args.msg))
    })

    socket.on('decrypting', (args)=>{
        const decr = decrypting(args.msg, args.pkey);
        socket.emit('catchingDecr', decr)
    });

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


const encryptMsg = (to, message)=>{
    // const Pbkey = new NodeRSA(to);
    const encrypted = to.encrypt(message, 'base64');
    // console.log('encrypted: ', encrypted);
    return encrypted;

}       

const decryptMsg = (to,message)=>{
    const Prkey = new NodeRSA(to); 
    const decrypted = Prkey.decrypt(message, 'utf8');
    console.log('decrypted: ', decrypted);
    return decrypted;
}

const encryptFormat = (to, from, msg)=> {
    // console.log(pkey)
    const pbKey = new NodeRSA(to.pubKey);
    const enc = encryptMsg(pbKey, msg);
    // return formatMessage(from.username, enc)
    return decryptFormat(enc,from,to.privKey);
}

const decryptFormat = (msg,from,prKey)=>{
    // const pKey = new NodeRSA(prKey);
    const decr = decryptMsg(prKey, msg);
    console.log(decr);
    return formatMessage(from.username, decr);

}
const decrypting = (msg,pkey)=>{
    try{
        const decr = decryptMsg(pkey, msg);
        return decr
    }
    catch(err){
        console.log(err);
    }finally{
        return msg;
    }

}

const PORT = 5000 || process.env.PORT;

server.listen(PORT, console.log('Server running on PORT: '+ PORT));




