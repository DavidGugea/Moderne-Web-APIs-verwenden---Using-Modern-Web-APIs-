const WebSocket = require("ws");

const wss = new WebSocket.Server({
    port: 8080
});

wss.on("connection", function(ws){
    console.log("New client connected !");

    ws.on("message", function(data){
        console.log(data);

        ws.send("I got your message !");
    });

    ws.on("close", function(){
        console.log("The client has been closed.");
    });
});