const rooms=[];

// Get rooms
function getRooms(){
    return rooms;
}

// Room creation
function roomCreated(roomName, keycode){
    const room = {roomName, keycode};
    rooms.push(room);
}

function removeCurrentRoom(roomName){
    const index = rooms.findIndex(room=> room.roomName=== roomName);
    if(index!=-1){
       rooms.splice(index,1);
    }
}

module.exports = {
    roomCreated,
    getRooms,
    removeCurrentRoom,
}