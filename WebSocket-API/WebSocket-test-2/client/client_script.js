// Create a new socket and bind it to the local host
let web_socket = new WebSocket("ws://localhost:8080");

document.addEventListener(
    "DOMContentLoaded",
    start
);
let button = document.getElementById("sendMessageToServer");

function start(){
    // Add event listeners for the web socket
    // web_socket event in when the web_socket is opened
    web_socket.onopen = function(){
        console.log("The web socket has been opened");

        // Since the client WebSocket is opened, the user can send messages to the server
        button.addEventListener("click", sendMessageToServer);
    };

    // web_socket event in case that an error occures
    web_socket.onerror = function(err){
        console.log("Client web socket error :");
        console.log(err);
    };

    // web_socket event when the web socket is closed
    web_socket.onclose = function(){
        console.log("The web socket has been closed!");  

        // If the client web-socket has been closed then the user shouldn't be able to send any other messages to the server no more, so we will just remove the event listener from the botton 
        button.removeEventListener("click", sendMessageToServer);
    };

    // web_socket event when the web socket **RECEIVES** a message from the server
    web_socket.onmessage = function(websocket_event){
        console.log(`Message received from the server -- > ${websocket_event.data}`);
    }

    // Add new selection ( see if the user wants eval for his/her message or not )
    // Create the options for the select-element
    let options = [
        { text : "Eval value", value: "eval" },
        { text : "Raw message", value : "raw" }
    ];

    // Create the select-element andd add an ID for it
    let selection = document.createElement("select");
    selection.setAttribute("id", "messageSend_select")

    // Create both options for the select-element
    let option_eval = new Option(options[0].text, options[0].value, true, true);
    let option_raw  = new Option(options[1].text, options[1].value, true, true);

    // Add both options to the select-element
    selection.add(option_eval);
    selection.add(option_raw);

    // Add the select-element to the <body> element
    document.querySelector("body").appendChild(selection);
}

function sendMessageToServer(){
    let select = document.getElementById("messageSend_select");
    let message = document.getElementById("messageToServer").value;

    if(select.value == "eval"){
        message = eval(message);
    }

    console.log(message);
    web_socket.send(message);
}