const users =[];

// join user to chat
function userJoin(id,username, room, keyword, privKey, pubKey){
    const count = users.filter(user=> user.id=== id).length;
    
    if(count > 1){
        const user = {}
        return user;

    }else{
        const user = {id,username,room, keyword, privKey, pubKey};
        users.push(user);
        return user;
    }
}

function countUsers(room){
    let count=0;
    users.forEach((user)=>{
        if(user.room==room[0].roomName){
            count++;
        }
    });

    return count;
}

// Get current user
function getCurrentUser(id){
    return users.find(user=> user.id=== id);
}

// User leaves chat
function userLeave(id){
    const index = users.findIndex(user=> user.id=== id);

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

// Get room users
function getRoomUsers(room){
    return users.filter(user=> user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    countUsers
}

// export defualt {
//     userJoin,
//     getCurrentUser,
//     userLeave,
//     getRoomUsers,
//     countUsers
// }