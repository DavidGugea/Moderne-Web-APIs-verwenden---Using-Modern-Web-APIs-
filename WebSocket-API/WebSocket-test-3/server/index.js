let ws = require("ws");
let WebSocketServer = new ws.Server({
    port: 8082
});

WebSocketServer.on("connection", (socket, request) => {
    socket.on("open", () => {
        console.log("A new client-socket connected to the server!");
    });

    socket.on("message", (msg) => {
        console.log(`Got a message from the client -- > ${msg}`);

        socket.send(msg);
    });

    socket.on("close", () => {
        console.log("The client-socket disconnected!");
    });
})