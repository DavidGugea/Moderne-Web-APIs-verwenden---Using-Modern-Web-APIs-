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
        // Send the message that we got back to ALL client-sockets
        WebSocketServer.clients.forEach((client) => {
            // If the client is opened
            if(client.readyState == WebSocket.OPEN){
                // Send the message to the client
                client.send(userMessage);
            }
        })
    });

    // Close event listener
    socket.on("close", () => {
        console.log("A client disconnected!");
    });
});