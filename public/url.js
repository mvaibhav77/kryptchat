const roomInput = document.getElementById('room');
const keycodeInput = document.getElementById('keyword');

// Get url params
const urlParams = new URLSearchParams(window.location.search);

const keycode = urlParams.get('keycode');
const roomName = urlParams.get('room');

// console.log(room, keycode);
if(roomName){
    roomInput.value = roomName;
}

if(keycode){
    keycodeInput.value = keycode;
}