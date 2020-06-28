// Create a web socket & web socket server
let WebSocket = require("ws");
let WebSocketServer = new WebSocket.Server({
    port: 8080
});

// Configure the server
WebSocketServer.on("connection", (socket, request) => {
    // Open event listener
    socket.on("open", () => {
        console.log("New client connected!");
    });

    // Message event listener
    socket.on("message", (userMessage) => {
        console.log(userMessage); // The user will
        
        // Send the message that we got back to ALL client-sockets
        WebSocketServer.clients.forEach((client) => {
            if(client.readyState == WebSocket.OPEN){
                client.send(userMessage);
            }
        })
    });

    // Close event listener
    socket.on("close", () => {
        console.log("A client disconnected!");
    });
});