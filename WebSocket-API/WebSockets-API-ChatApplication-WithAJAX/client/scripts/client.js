document.addEventListener(
    "DOMContentLoaded",
    canvasCirclesAnimation
);

document.getElementById("loginButton").addEventListener(
    "click",
    login 
);

function canvasCirclesAnimation(){
    // Get the canvas elements
    let firstCanvas = document.getElementById("firstCircleCanvasAnimation");
    let secondCanvas = document.getElementById("secondCircleCanvasAnimation");

    // Get the rendering contexts for both canvas-elemetns
    let first_canvasRenderingContext = firstCanvas.getContext("2d");
    let second_canvasRenderingContext = secondCanvas.getContext("2d");

    // Set up the colors
    let colors = [
        "#A8DADC", "#457B9D"
    ];

    // Set up the lineCap to be round and the lineWidth to be 1 for both canvas-elements
    first_canvasRenderingContext.lineCap = "round";
    first_canvasRenderingContext.lineWidth = 1;
    second_canvasRenderingContext.lineCap = "round";
    second_canvasRenderingContext.lineWidth = 1;

    // Draw the first circle on the left-top side of the screen
    first_canvasRenderingContext.beginPath();
    first_canvasRenderingContext.moveTo(0, 0);

    first_canvasRenderingContext.arc(
        -100, -100,
        300,
        0, Math.PI * 2,
        false
    );

    first_canvasRenderingContext.fillStyle = colors[0];
    first_canvasRenderingContext.fill();
    
    // Draw the second circle on the right-top side of the screen
    second_canvasRenderingContext.beginPath();
    second_canvasRenderingContext.moveTo(secondCanvas.width, 0);

    second_canvasRenderingContext.arc(
        secondCanvas.width, 0,
        300,
        0, Math.PI * 2,
        false
    );

    second_canvasRenderingContext.fillStyle = colors[1];
    second_canvasRenderingContext.fill();
}

function login(event){

    // event.preventDefault() will stop the button from confirming the 'form'-element and loading a new page 
    event.preventDefault();
    
    // Get all the users from the github-api using ajax ( so we will have to make a new xhr-request )
    // I decided to build everything from the ground-up without using jquery or the fetch-api 
    let xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = (event) => {
        if(xhr.status == 200 && xhr.readyState == 4){
            // Fetch the users from the request
            users = JSON.parse(xhr.responseText);

            // Get the username & node_id from the user
            let username = document.getElementById("username").value;
            let node_id = document.getElementById("password").value;
            let user;

            // Search for the user
            for(let i = 0 ; i < users.length ; i++){
                if(users[i].login == username && users[i].node_id == node_id){
                    user = users[i];
                    break;
                }else{
                    continue;
                }
            }

            if(!user){
                // In case the during the for-looop we couldn't find the user, the 'user' variable will remain "undefined", so, for 5 seconds, we will change the title color to red and it's text to be "Wrong username or password" 
                let h1 = document.getElementById("title");
                h1.textContent = "Wrong username or password";
                h1.style.color = "#E63946";

                window.setTimeout(function(){
                    h1.textContent = "Log In";
                    h1.style.color = "#000000";
                }, 5000);
            }else{
                // Create a client-web-socket and bind it to the localhost web-socket server on port 8080
                const websocket_port = 8080;
                let connection = new WebSocket(`ws://localhost:${websocket_port}`);

                // Register every message received from the server to the client and make a paragraph with it and add it in the section#chat-app
                connection.onmessage = (MessageEvent) => {
                    // Get the section#chat-app element from HTML
                    let chatAppSection = document.querySelector("section#chat-app");

                    // Create a new paragraph element and include the message from the server in the textContent property
                    let serverMessage = document.createElement("p");
                    serverMessage.textContent = MessageEvent.data;

                    // Append the new paragraph to the chatAppSection
                    chatAppSection.appendChild(serverMessage);
                }

                // Create a new div called "user_div" 
                let user_div = document.createElement("div");

                // Add the class to "seeUser" so we can display it on the screen
                user_div.classList.add("seeUser");

                // Create an avatar for the user by taking the 'avatar_url' property
                let avatar = document.createElement("img");
                avatar.setAttribute("src", user.avatar_url);
                avatar.setAttribute("alt", "User Avatar");
                avatar.classList.add("userAvatar");

                // Create a new div that will come inside the big 'user_div' element ( we are using this so we can split up the information & log-out button with the img in 2 sepparte columns using CSS-grid )
                let userInfo = document.createElement("div");

                // Add all the properties using an array
                let userInfo_PropertyArray = ["login", "id", "node_id", "avatar_url", "type", "site_admin"];

                userInfo_PropertyArray.forEach((property) => {
                    let paragraph = document.createElement("p");
                    let value = eval(`user.${property}`);
                    paragraph.textContent = `${property} : ${value}`;

                    userInfo.appendChild(paragraph);
                });

                // Create the input element so the user can send a message to the chat ( server ) 
                let input = document.createElement("input");

                // Set its type to be text & its placeholder to describe what's it's being used for & add a class to it so we can style it using css
                input.setAttribute("type", "text");
                input.setAttribute("placeholder", "Enter here your text");
                input.classList.add("userInputSendText");

                // Add the 'enter' keypress event for the input, so when the user presses the 'enter' button on his/her keyboard after writing his text, the text will be sent to the server
                input.addEventListener(
                    "keypress",
                    (event) => {
                        if(event.key == "Enter"){
                            if(input.value.trim()){
                                // Send the user message to the web-socket server using the 'connection' variable.
                                let messageSent = `${user.login} : ${input.value.trim()}`; // Send the message to the server with the username in the front 
                                connection.send(messageSent);
                            }
                        }
                    }
                )

                // Add the input element to the userInfo-element
                userInfo.appendChild(input);

                // Create the logout button and add the class & textContent & click-event to it
                let logoutButton = document.createElement("button");
                logoutButton.classList.add("logoutButton");
                logoutButton.textContent = "Log Out";

                logoutButton.addEventListener(
                    "click",
                    (event) => {
                        /*
                        When the user wants to log-out of his/her account we must:
                            -> remove the user_div, so all the information about the user from the log-section ( avatar (img) & the information of the user, like node_id, etc. )
                            -> Add the 'hideChatApplication' to the chat, because the user is not allowed to chat after he logs-out 
                            -> Set the display of the 'login-section' again to block, so the user can see the login-section and log back in if he/she feels like it
                            -> Empty out the login-section inputs ( username & password )
                            -> Close the connection with the server
                        */
                        document.querySelector("section#log-section").removeChild(user_div);
                        document.querySelector("section#chat-app").classList.add("hideChatSection");
                        document.querySelector("div#login-section").style.display = "block";

                        document.getElementById("username").value = new String();
                        document.getElementById("password").value = new String();

                        connection.close();
                    }

                )

                // Add the logoutButton to the userInfo ( because the button will be right under the user-information, so we want to add it last )
                userInfo.appendChild(logoutButton);

                // Add the user avatar & the user-info to the user_div element 
                user_div.appendChild(avatar);
                user_div.appendChild(userInfo);

                /*
                When the user wants to log-in into his/her account we must`:
                    -> Append the user_div element to the log-section
                    -> We will want to see the chat, so we will remove the 'hideChatSection' from the chat-section so we can see the chat
                    -> We won't want to see the 'login-section' again since we have already logged in, so in order for us to stop seeing it again, we will set it's display to be 'none'
                */
                document.querySelector("section#log-section").appendChild(user_div);
                document.querySelector("section#chat-app").classList.remove("hideChatSection");
                document.querySelector("div#login-section").style.display = "none";
            }
        }
    }

    // Configure xhr-request
    xhr.open(
        "GET",
        "https://api.github.com/users"
    );

    xhr.setRequestHeader("accept", "application/json");
    xhr.send();
};