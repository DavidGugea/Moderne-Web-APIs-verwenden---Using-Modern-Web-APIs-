/* GENERAL VARIABLES & METHODS */

/************************************************************************************/
let user;
/************************************************************************************/

// A function for all the div.products in the delete_section ( when the user clicks on the image of an image the image will toggle some properties. It's exactly like the function for the div.product-elements in the buy-section but this one can't be used when the document is loaded, because the user is not logged in yet and we can't read any items inside the div#delete_products so that's why we have to make a separate function )
function deleteProduct_Click(product){
    /*
        When the user clicks on the image of a product in the div#delete_products
        * If the parent-element ( div.product ) has the data-target-selected attribute with the value 'false', then that means that the user wants to delete that product so we will set the data-target-selected attribute to 'true' and give it a red-like color border
        * If the parent-element ( div.product ) has the data-target-selected attribute with the value 'true', then that means that the user doesn't want to delete that product anymore, so we will set the data-target-selected attribute back to 'false' and remove the border 
    */

    product.querySelector("img.product-image").addEventListener(
        "click",
        (event) => {
            if(product.getAttribute("data-target-selected") == "false"){
                product.setAttribute("data-target-selected", "true");
                product.style.border = "5px solid #BF472C";
            }else{
                product.setAttribute("data-target-selected", "false");
                product.style.border = new String();
            }
        }
    );
};

// A function that is used to load the cookies. That means that we read the cookies from the document.cookie and based on the user.id property we load the cookies inside ( section#delete-section div#delete_products )
function loadCookies(){
    /*
    A cookie for a key must look like this:
    {
        key : USER.ID ( property of the user )
        value : [
                    [
                        [data-target-id of product, product-title, img source, product-price, product-amount],
                        [data-target-id of product, product-title, img source, product-price, product-amount],
                        [data-target-id of product, product-title, img source, product-price, product-amount],
                        ...
                    ],
                    TOTAL PRICE OF THE PRODUCTS,
                    TOTAL AMOUNT OF PRODUCTS
        ]
    }
    */

    // Delete all the children from div#delete_products
    let children = document.querySelectorAll("section#user-section section#delete-section div#delete_products div.product")
    children.forEach((product) => {
        document.querySelector("section#user-section section#delete-section div#delete_products").removeChild(product);
    });


    // Check if the user is not undefined and if the document.cookie is not empty
    if(user!=undefined && document.cookie != new String()){
        // Search for the user value inside the cookie
        let USER_DATA = document.cookie.split(";").find((cookie_string) => cookie_string.split("=")[0].trim() == user.id.toString());

        if(USER_DATA){
            // Split cookie by '='-char
            let cookie_split = USER_DATA.split("=");

            // Take the key & the value of the cookie
            let COOKIE_key = eval(cookie_split[0]);
            let COOKIE_value = eval(cookie_split[1]);

            // Modify the price & the amount of products 
            document.querySelector("div#delete_products_info p#total-products-price").textContent = `Total price of products : ${COOKIE_value[1]} $`;
            document.querySelector("div#delete_products_info p#total-products-amount").textContent = `Total amount of products : ${COOKIE_value[2]}`;

            // Modify the grid-properties of the the main-parent-element ( div#delete_products )
            let PARENT = document.querySelector("div#delete_products");
            let length = COOKIE_value[0].length;
            PARENT.style.gridTemplateColumns = "repeat(3, 1fr)";
            PARENT.style.gridTemplateRows = `repeat(${Math.floor(length / 3)}, 1fr)`;

            // Add all the products
            COOKIE_value[0].forEach((product_list) => {
                // Create parent-element div.product with the data-target-id
                let parent_div = document.createElement("div");
                parent_div.classList.add("product");
                parent_div.setAttribute("data-target-id", product_list[0]);
                parent_div.setAttribute("data-target-selected", "false");

                // Create product-title
                let product_title = document.createElement("h2");
                product_title.classList.add("class", "product-title");
                product_title.textContent = product_list[1];

                // Create img ( product-image )
                let product_image = document.createElement("img");
                product_image.setAttribute("src", product_list[2]);
                product_image.setAttribute("alt", product_list[1]); 
                product_image.setAttribute("class", "product-image");

                // Create product-price
                let product_price = document.createElement("p");
                product_price.setAttribute("class", "product-price");
                product_price.textContent = `${product_list[3]} $`;

                // Create product-amount
                let product_amount = document.createElement("p") ;
                product_amount.setAttribute("class", "product-amount");
                product_amount.textContent = `Amount : ${product_list[4]}`;

                // Add everything to the parent-element 
                parent_div.appendChild(product_title);
                parent_div.appendChild(product_image);
                parent_div.appendChild(product_price);
                parent_div.appendChild(product_amount);

                // Add event listener for the image
                deleteProduct_Click(parent_div);

                // Add the parent-div to the delete_products section
                PARENT.appendChild(parent_div);
            });
        }
    }
}

/* GENERAL VARIABLES & METHODS */

/* CANVAS ANIMATION */
let canvas = document.querySelector("canvas#animation-canvas");
let ctx = canvas.getContext("2d");
let amountOfCirclesGenerated_AtLoad = 20;
let circles = new Array();
let animationHandler;
let negative_positive_direction_velocity = [1, -1];

const colors = [
    "#275D8C",
    "#204C73",
    "#0D1A26",
    "#F29849",
    "#BF472C"
];


class Circle{
    constructor(posX, posY, velocityX, velocityY, color, radius){
        this.posX = posX;
        this.posY = posY;
        this.velocityX = velocityX;
        this.velocityY = velocityY;

        this.color = color;
        this.radius = radius;
    }
    changePosition(){
        this.posX += this.velocityX;
        this.posY += this.velocityY;
    }
    checkCollision(){
        // X-Axis - > Left & Right wall
        if(this.posX + this.radius > canvas.width || this.posX - this.radius < 0){
            // Modify the velocity
            this.velocityX *= -1;
        }

        // Y-Axis -> Up & Bottom wall
        if(this.posY + this.radius > canvas.height || this.posY - this.radius < 0){
            // Modify the velocity
            this.velocityY *= -1;
        }
    }
    draw(){
        ctx.beginPath();
        ctx.moveTo(this.posX, this.posY);

        ctx.arc(
            this.posX, this.posY,
            this.radius,
            0, Math.PI * 2,
            false // It doesn't matter if it's clockwise or not since it's a circle
        ); 

        ctx.fillStyle = this.color;
        ctx.fill();
    }
    run(){
        this.changePosition();
        this.checkCollision(); 
        this.draw();
    }
}

// Generate the given amount of circles 
function generateCircles(amount){
    // Make sure the circles-array is empty
    circles = new Array();

    // Make the circles and fill the array
    for(let i = 0 ; i < amount ; i++){
        let radius = Math.floor(Math.random() * 5 + 5);

        let posX = Math.floor(Math.random() *  ( canvas.width - radius ) ) + radius;
        let posY = Math.floor(Math.random() *  ( canvas.height - radius ) ) + radius;

        let velocityX_directionModifier = negative_positive_direction_velocity[Math.round(Math.random())];
        let velocityY_directionModifier = negative_positive_direction_velocity[Math.round(Math.random())];

        let velocityX = Math.floor(Math.random() * 1 + 1) * velocityX_directionModifier;
        let velocityY = Math.floor(Math.random() * 1 + 1) * velocityY_directionModifier;

        let color = colors[Math.floor(Math.random() * colors.length)];

        circles.push(
            new Circle(
                posX, posY,
                velocityX, velocityY,
                color, radius
            )
        );
    }
}

// 'animateCanvas'-function used to apply the 'run' method to all the generated circles & use non-stop recursion for the window.requestAnimationFrame-function
function animateCanvas(){
    // Clear out the canvas before drawing something new on it 
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Run each circle through
    circles.forEach((circle_object) => {
        circle_object.run();
    });
    
    // Request animation frame ( used recursive inside 'animateCanvas'-function so that it doesn't stop )
    animationHandler = window.requestAnimationFrame(animateCanvas);
}

// Add event listener for when the dom is loaded to generate all the circles & start the animation ( using window.requestAnimationFrame )
document.addEventListener(
    "DOMContentLoaded",
    (event) => {
        generateCircles(amountOfCirclesGenerated_AtLoad);
        animationHandler = window.requestAnimationFrame(animateCanvas);
    }
);

/* CANVAS ANIMATION */

/* LOGIN SECTION */

// Add event listener for the login-button
document.querySelector("button#login-button").addEventListener(
    "click",
    (event) => {
        // Get user input ( username & password )
        let username = document.querySelector("input#username").value.trim();
        let password = document.querySelector("input#password").value.trim();

        if(username != new String() && password != new String()){
            login(username, password);
        }else{
            errorMessage();
        }
    }
);


function errorMessage(){
    // Get the title of the login-section
    let title = document.querySelector("h1#login-title");

    // Change the textContent & color properties of the title
    let title_color = title.style.color;

    title.textContent = "Wrong username or password";
    title.style.color = "#BF472C";

    // After 5 seconds, change it back to normal
    window.setTimeout(
        () => {
            title.textContent = "Log In";
            title.style.color = title_color;
        }, 
        5000 // 5000ms = 5 seconds
    );
}


// A function that will 'fire up' after the user has pressed the login button ( button#login-button ) and after we get the username & password and check if they are not empty
function login(username, password){
    // Use AJAX ( XHR-request, no jQuery or fetch-API )
    let xhr = new XMLHttpRequest();

    xhr.addEventListener(
        "readystatechange",
        (event) => {
            if(xhr.readyState == 4 && xhr.status == 200){
                // Store all the users in a variable by parsing the responseText with JSON
                let ALL_USERS = JSON.parse(xhr.responseText);

                // Create the user | For the time - undefined -
                let xhr_user;

                // Find the user 
                for(let i = 0 ; i < ALL_USERS.length ; i++){
                    if(ALL_USERS[i].login == username && ALL_USERS[i].node_id == password){
                        xhr_user = ALL_USERS[i];
                        break;
                    }else{
                        continue;
                    }
                }

                if(xhr_user == undefined){
                    errorMessage();
                }else{
                    user = xhr_user;
                    logUserIn();
                    loadCookies();
                }
            }
        }
    )
    
    xhr.open(
        "GET",
        "https://api.github.com/users"
    );
    xhr.setRequestHeader("accept", "application/json");

    xhr.send();
}

// This function is used when the user has to log in ( changes displays && stops animations )
function logUserIn(){
    // Stop animation
    window.cancelAnimationFrame(animationHandler);

    // Set display of the canvas && of the login-section to none
    document.querySelector("canvas#animation-canvas").style.display = "none";
    document.querySelector("section#login-section").style.display = "none";

    // Set the display of the user-section to block & set the overflow of 'body' to default ( overflow : scroll)
    document.querySelector("section#user-section").style.display = "block";
    document.querySelector("body").style.overflow = "scroll";
}

/* LOGIN SECTION */

/* SECTION - USER SECTION - ALL */

// Add event listener for all the div.products ( click-event for the images etc. )
document.addEventListener(
    "DOMContentLoaded",
    (event) => {
        let buy_products = document.querySelectorAll("section#user-section section#buy-section div#products div.product");
        for(let i = 0 ; i < buy_products.length ; i++){
            let product = buy_products.item(i);

            /*
            When the user clicks on the image of a product :
                * If the product data-target-selected attribute is false, then change it to true and modify the border of the parent-element to be a green-like color ( if and only if the input.product-amount value is not empty )
                * If the product data-target-selected attribute is true, then change it to false and delete the border of the parent-element
            */

            product.querySelector("img.product-image").addEventListener(
                "click",
                () => {
                    let data_target_selected_ATTR = product.getAttribute("data-target-selected");
                    switch(data_target_selected_ATTR){
                        case "false":
                            if(eval(product.querySelector("input.product-amount").value) > 0){
                                product.setAttribute("data-target-selected", "true");
                                product.style.border = "5px solid rgb(94, 219, 94)";
                            }

                            break;
                        case "true":
                            product.setAttribute("data-target-selected", "false");
                            product.style.border = new String();

                            break;
                        default:
                            console.error(data_target_selected_ATTR);
                    }
                }
            );
        }
    }
);

// Add event listener for the add button
document.querySelector("section#user-section section#buy-section button#addButton").addEventListener(
    "click",
    (event) => {
        /*
        A cookie for a key must look like this:
        {
            key : USER.ID ( property of the user )
            value : [
                        [
                            [data-target-id of product, product-title, img source, product-price, product-amount],
                            [data-target-id of product, product-title, img source, product-price, product-amount],
                            [data-target-id of product, product-title, img source, product-price, product-amount],
                            ...
                        ],
                        TOTAL PRICE OF THE PRODUCTS,
                        TOTAL AMOUNT OF PRODUCTS
            ]
        }
        */

        // Get all the selected items from the div#products in the buy-section
        let selected_products = document.querySelectorAll("section#user-section section#buy-section div#products div.product[data-target-selected='true']");

        // Check if the user is inside the cookies keys or not | If he's not in the cookies, add all the items, otherwise check what items were already added and change the value of the cookie & add the ones that were not in the cookie-value yet 
        let USER_COOKIE = document.cookie.split(";").find((cookie_string) => cookie_string.split("=")[0] == user.id);

        // Keep the value & key stored inside a variable
        let key = user.id;
        let value;

        if(USER_COOKIE == undefined){
            // The user couldn't be found in the cookie. Add all the selected items to the cookies with a new key ( user.id )
            value = [[], 0, 0];

            selected_products.forEach((product_element) => {
                value = add_ProductInfo_toCookie(product_element, value);
            });
        }else{
            // The user was found in the cookie. Modify the value of the cookie
            value = eval(USER_COOKIE.split("=")[1]);

            selected_products.forEach((product_element) => {
                // Check if the product is in the cookie-value or not & get the index
                let index;
                for(let i = 0 ; i < value[0].length ; i++){
                    if(value[0][i][0] == product_element.getAttribute("data-target-id")){
                        index = i;
                        break;
                    }else{
                        continue;
                    }
                }

                if(index == undefined){
                    // If the index couldn't be found, the that means that the product hasn't already been selected by the user so we can add it to the cookie-value and we don't have to modify anything

                    value = add_ProductInfo_toCookie(product_element, value);
                }else{
                    let product_price = eval(product_element.querySelector("p.product-price").textContent.split(" ")[0].trim());
                    let product_amount = eval(product_element.querySelector("input.product-amount").value);

                    // Add to the product-amount of the product list 
                    value[0][index][4] += product_amount

                    // Change the total price of products
                    value[1] += product_price * product_amount;

                    // Change the total amount of products
                    value[2] += product_amount;
                }
            });
        }

        // Transform the value into a string while still keeping the 'Array-Structure'
        value = JSON.stringify(value);

        // Store the key & value in the cookies
        document.cookie = `${key}=${value};path=/`;

        // Load the new cookie
        loadCookies();
    }
);

// A function that is used inside the event listener for the add-to-cart-button ( on click ) to add product element to the cookie-value
function add_ProductInfo_toCookie(product_element, value){
    // Create the product list
    let product_list = new Array();

    // Add the data-target-id
    product_list.push(product_element.getAttribute("data-target-id"));
    
    // Add the product-title
    product_list.push(product_element.querySelector("h2.product-title").textContent);

    // Add the img source
    product_list.push(product_element.querySelector("img.product-image").getAttribute("src"));

    // Add the product-price
    let product_price = eval(product_element.querySelector("p.product-price").textContent.split(" ")[0].trim());
    product_list.push(product_price);

    // Add the product-amount
    let product_amount = eval(product_element.querySelector("input.product-amount").value);
    product_list.push(product_amount);

    // Add the product list with all the needed information about the product to the value[0]
    value[0].push(product_list);

    // Add to the total price of products
    value[1] += product_price * product_amount;

    // Add the the total amount of products
    value[2] += product_amount;

    return value;
}

// Add event listener for the delete button
document.querySelector("section#user-section section#delete-section  button#deleteButton").addEventListener(
    "click",
    (event) => {
        /* Delete all the div.product-elements in div#delete_products with the data-target-selected='true' from the cookies */

        // Get the key & value of the user-cookie
        let key = user.id;
        let value = eval(document.cookie.split(";").find((cookie_string) => cookie_string.split("=")[0].trim() == key).split("=")[1].trim());

        // Store the data_target_ids that need to be deleted
        let delete_IDS = new Array();

        document.querySelectorAll("section#user-section section#delete-section div#delete_products div.product[data-target-selected='true']").forEach((product) => delete_IDS.push(product.getAttribute("data-target-id")));
        
        // Delete the IDS from value
        delete_IDS.forEach((ID) => {
            // Find the index of the product list in the value[0]-list that has the ID
            let index;
            for(let i = 0 ; i < value[0].length ; i++){
                if(value[0][i][0] == ID){
                    index = i;
                    break;
                }else{
                    continue;
                }
            }

            let product_price = value[0][index][3];
            let product_amount = value[0][index][4];

            // Take out from the total price of the products
            value[1] -= product_price * product_amount;

            // Take out from the total amount of products
            value[2] -= product_amount;

            // Delete the list from the value-list
            value[0].splice(index, 1);
        });

        // Transform the value into a string while still keeping the 'Array-Structure'
        value = JSON.stringify(value);

        // Save the new cookie
        document.cookie = `${key}=${value};path=/`;

        // Load the new cookie
        loadCookies();
    }
);

/* SECTION - USER SECTION - ALL */

/* LOGOUT - BUTTON */

document.getElementById("logout_button").addEventListener(
    "click",
    (event) => {
        // Empty out all input.product-amount value properties
        let input_productAmount = document.querySelectorAll("input.product-amount");

        input_productAmount.forEach((product) => {
            product.value = null; 
        });

        // Change all the data-target-selected & border-styles of the div.product-elements to default ( false & '' )
        let products = document.querySelectorAll("div.product");
        products.forEach((product) => {
            product.setAttribute("data-target-selected", "false");
            product.style.border = new String();
        });

        // Change the display of the user section to none & the display of the login section to block
        document.querySelector("section#login-section").style.display = "block";
        document.querySelector("section#user-section").style.display = "none";

        // Change the display of the canvas animation to be block
        document.querySelector("canvas#animation-canvas").style.display = "block";
        generateCircles(amountOfCirclesGenerated_AtLoad);
        animationHandler = window.requestAnimationFrame(animateCanvas);

        // Change the overflow-css-property of the body to be hidden
        document.querySelector("body").style.overflow = "hidden";
    }
)

/* LOGOUT - BUTTON */