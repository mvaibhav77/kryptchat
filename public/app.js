const messageBodies=[];

// Get msgs
function getMessages(){
     return messageBodies;
}

const socket = io();


let encryptKey;
let userPrivKey = '';
// Encrypt on room creation
socket.on('encrypting', args=>{
    console.log(args);
    encryptKey = Number(args.room[0].keycode);
    encryptKey=encryptKey%11;
    console.log(encryptKey);
    // console.log(args.user.privKey);
    userPrivKey = args.user.privKey;
    // console.log(userPrivKey);
})


// msg creation
function msgCreated(name, time, text){
    name = encryptMsg(name,encryptKey);
    time = encryptMsg(time,encryptKey);
    text = encryptMsg(text,encryptKey);
    const message = {name,time, text};
    messageBodies.push(message);
    outputMessage(message);
}

// const joinChatForm = document.getElementById('joinChat');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const messages = document.getElementsByClassName('message');
const decrypt = document.getElementById('decryptBtn');
const share = document.getElementById('shareLink');
// const joinBtn = document.getElementById('joinBtn');

// Get username, room and keyword from url
const {username, room, keyword} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username,room,keyword);

share.addEventListener('click', (e)=>{
    e.preventDefault()
    // copy link
    let link = window.location.origin + `?room=${room}&keycode=${keyword}`
    navigator.clipboard.writeText(link);

    // Change button look
    share.textContent = "Link Copied!!";

    setTimeout(()=>{
        share.innerHTML=`<i class="fa-solid fa-link"></i> Invite Others`;
    }, 2000);
    

})

// Join chatroom
socket.emit('joinRoom', {username, room, keyword});

// Get room users
socket.on('roomUsers', ({room,users}) =>{
    outputRoomName(room);
    outputUserNames(users);
    outputKeyword(keyword);
})


// Message from server
socket.on('message', message=>{
    console.log(message);
    msgCreated(message.user, message.time, message.text);
    DecryptAll();
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

let decryptKey = keyword;
decryptKey = Number(decryptKey)
// decrypt on click
decrypt.addEventListener('click',(e)=>{
    DecryptAll();
})

function DecryptAll(){
    const code = document.getElementById('keywordValue').value
    if(code){
        decryptKey = code;
    }
    console.log(decryptKey)
    decryptKey= Number(decryptKey);
    decryptKey = decryptKey%11;
    decryptChat(decryptKey);
}


// Message submit
chatForm.addEventListener('submit', e =>{
    const msg = e.target.elements.msg.value;

    // emitting a message to server
    // console.log(userPrivKey);
    socket.emit('chatMessage', {msg: msg});
    e.target.elements.msg.value='';
    e.preventDefault();
})


// Output message too DOM
function outputMessage(message){
    const div  = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<span class="meta">${message.name}&nbsp;</span><span class="meta-date"> ${message.time}</span>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Output room name
function outputRoomName(room){
    document.querySelector('#room-name').innerHTML= room;
}

// Output user names
function outputUserNames(users){
    let output='';
    // console.log(users);
    users.forEach(user => {
        output+=`<li class="list-group-item">${user.username}</li>`;
    });

    document.querySelector('#users').innerHTML=output;
}


// Output keyword
function outputKeyword(keyword){
    document.querySelector('#keywordValue').value=keyword;
}


// Encription and Decription

// Encription
function encryptMsg(msg, key){
    let output='';
    for(let i=0;i<msg.length;i++){
        if (msg.charCodeAt(i)>=65 && msg.charCodeAt(i)<=90){
            let tempstr = msg.charCodeAt(i) + key;
            if(tempstr>90){
                tempstr=tempstr%90 +64;
            }
            output += String.fromCodePoint(tempstr);
        }else if(msg.charCodeAt(i)>=97 && msg.charCodeAt(i)<=122){
            let tempstr = msg.charCodeAt(i) + key;
            if(tempstr>122){
                tempstr = tempstr%122 + 96;
            }
            output += String.fromCodePoint(tempstr);
        }else{
            output += String.fromCodePoint(msg.charCodeAt(i) + key);
        }
    }
    return output;
}

// // Decryption
function decryptMsg(ptr,key1){
    // console.log(ptr, key1);
    let dncstring = "";
    for(let i=0;i<ptr.length;i++){
        if(ptr.charCodeAt(i)>=65 && ptr.charCodeAt(i)<=90){
            if(ptr.charCodeAt(i)>(64+key1)){
                dncstring += String.fromCodePoint((ptr.charCodeAt(i)-key1-65)%26+65);
            }else{
                dncstring+= String.fromCharCode((ptr.charCodeAt(i))%64 -key1+90);
            }
            // console.log(dncstring);
        }else if((ptr.charCodeAt(i))>=97 && (ptr.charCodeAt(i)<=122)){
            if(ptr.charCodeAt(i)>(96+key1)){
                dncstring += String.fromCodePoint((ptr.charCodeAt(i)-key1-97)%26+97);
            }else{
                dncstring+= String.fromCharCode((ptr.charCodeAt(i))%96 -key1+122);
            }
            // console.log(dncstring);
        }else{
            dncstring+= String.fromCodePoint(ptr.charCodeAt(i)-key1)
            // console.log(dncstring);

        }
    }
    return dncstring;
}

// let key = 13;
// key = key%9;
// console.log(key);
// console.log(encryptMsg('hi123',key));
// console.log(decryptMsg(encryptMsg('hi123',key),key));

// // encrypting messages

// function encryptChat(){
//     let msgElements;
//     for(let i=0;i<messages.length;i++){
//         // console.log(messages[i].innerText);
//         msgElements = messages[i].children;
//         for(let j=0;j<msgElements.length;j++){
//             msgElements[j].innerText = encryptMsg(msgElements[j].innerText, encryptKey);
//             // console.log(msgElements[j].innerText, j)
//         }
//         msgCreated(msgElements[0].innerText,msgElements[1].innerText,msgElements[2].innerText)

//         // console.log(msgElements[1].innerText)
//     }
//     console.log(getMessages());
// }

function decryptChat(decryptKey){
    let msgElements;
    console.log(decryptKey)
    for(let i=0;i<messages.length;i++){
        // console.log(messages[i].innerText);
        let message = getMessages()[i];
        msgElements = messages[i].children;
        // console.log(decryptKey);
        msgElements[0].innerText = decryptMsg(message.name, decryptKey);
        msgElements[1].innerText = ' '+decryptMsg(message.time, decryptKey);
        msgElements[2].innerText = decryptMsg(message.text, decryptKey);

    }
}

// Sidemenu Collapse and appear button

const collapse =document.getElementById('collapse');
const sidemenu = document.querySelector('.chat-sidebar');
collapse.addEventListener('click', (e)=>{
    e.preventDefault();
    if(sidemenu.classList.contains('hidden')){
        sidemenu.classList.remove('hidden');
        collapse.innerHTML = '<i class="fa fa-xmark"></i>'
    }else{
        sidemenu.classList.add('hidden');
        collapse.innerHTML = '<i class="fa fa-bars"></i>'
    }
})

document.addEventListener('DOMContentLoaded' ,(e)=>{
    if(window.innerWidth < 576){
        if(!sidemenu.classList.contains('hidden')){
            sidemenu.classList.add('hidden');
        }
    }else{
        if(sidemenu.classList.contains('hidden')){
            sidemenu.classList.remove('hidden');
        }
    }
})

window.addEventListener('resize',(e)=>{
    e.preventDefault();
    
    if(window.innerWidth < 576){
        if(!sidemenu.classList.contains('hidden')){
            sidemenu.classList.add('hidden');
        }
    }else{
        if(sidemenu.classList.contains('hidden')){
            sidemenu.classList.remove('hidden');
        }
    }
})