let server = require("ws");

let WebSocket = new server.Server({
    port: 8080
});

WebSocket.on("connection", function(websocket){
    console.log("A new client has been registered to the server.");

    websocket.on("message", function(data){
        console.log(`Message got from the client -- > ${data} [ Type : ${typeof data} ]`);
        
        websocket.send(`I am the server, I got your message. The message that you gave me was -- > ${data}`);
    });

    websocket.on("close", function(code, reason){
        console.log(`The client has been closed. Reason : ${reason}`);
    });
});