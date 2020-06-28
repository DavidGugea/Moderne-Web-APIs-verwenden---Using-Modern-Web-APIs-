let connection = new WebSocket("ws://localhost:8082");

connection.onopen = function(e){
    console.log("Connection opened");
    connection.send("I am the new client and I connected to the server ws://localhost:8082");
}

connection.onmessage = function(MessageEvent){
    let data = MessageEvent.data;
    try{
        data = JSON.parse(data);
    }catch(error){
        data = data.toString(); 
    }

    console.log(data);
}

connection.onerror = function(error){
    console.log(error);
}

connection.onclose = function(e){
    console.log("connection closed.");
}