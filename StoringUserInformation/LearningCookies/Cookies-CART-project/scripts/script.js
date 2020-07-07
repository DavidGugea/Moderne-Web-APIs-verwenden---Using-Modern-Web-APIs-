// Build up the canvas animations
document.addEventListener("DOMContentLoaded", canvasAnimation);

function draw(canvas, amountOfFigures, colors) {
  let ctx = canvas.getContext("2d");

  for (let i = 0; i < amountOfFigures; i++) {
    /*
            Deciding if we will draw a circle or a rectangle :
                -> Draw a circle probability : 40%
                -> Draw a rectangle probability : 50%;
                -> Draw a square probability : 10%;
        */
    let chances = Math.floor(Math.random() * 100);
    let drawingType = new String();

    if (0 <= chances && chances < 40) {
      drawingType = "circle";
    } else if (40 <= chances && chances <= 90) {
      drawingType = "rectangle";
    } else {
      drawingType = "squre";
    }

    // Search for position
    let pos_x = Math.floor(Math.random() * (canvas.width - 50));
    let pos_y = Math.floor(Math.random() * (canvas.height - 50));

    // Get the color of the figure from the given colors array
    let figureColor = colors[Math.floor(Math.random() * colors.length)];

    // Find out the dimension of the figure based on the type of figure that it is
    let width;
    let height;
    let radius;

    if (drawingType == "square" || drawingType == "rectangle") {
      width = Math.floor(Math.random() * 50 + 50);

      if (drawingType == "square") {
        height = width;
      } else {
        while (height != width) {
          height = Math.floor(Math.random() * 50 + 50);
        }
      }
    } else if (drawingType == "circle") {
      radius = Math.floor(Math.random() * 10 + 10);
    }

    // Draw the figure
    ctx.beginPath();
    ctx.moveTo(pos_x, pos_y);

    switch (drawingType) {
      case "square":
      case "rectangle":
        ctx.rect(pos_x, pos_y, width, height);
        break;
      case "circle":
        ctx.arc(
          pos_x,
          pos_y,
          radius,
          0,
          Math.PI * 2,
          false // it doesn't matter, it's a circle
        );
        break;
    }

    ctx.fillStyle = figureColor;
    ctx.fill();
  }
}

function canvasAnimation(event) {
  /*
    COLOR SCHEME:
    * #F291A3
    * #D991B3
    * #8F9AD9
    * #7386BF
    * #F2B1A2

    source -- > https://color.adobe.com/explore?page=2
    */
  let colors = ["#F291A3", "#D991B3", "#8F9AD9", "#7386BF", "#F2B1A2"];

  // Get all the canvas-elements
  let canvas_TopLeft = document.querySelector(
    "canvas#login-section-canvas-animation-top_left"
  );
  let canvas_TopRight = document.querySelector(
    "canvas#login-section-canvas-animation-top_right"
  );
  let canvas_BottomLeft = document.querySelector(
    "canvas#login-section-canvas-animation-bottom_left"
  );
  let canvas_BottomRight = document.querySelector(
    "canvas#login-section-canvas-animation-bottom_right"
  );

  draw(canvas_TopLeft, 10, colors);
  draw(canvas_TopRight, 10, colors);
  draw(canvas_BottomLeft, 10, colors);
  draw(canvas_BottomRight, 10, colors);
}

// Login
document.querySelector("input#login-button").addEventListener("click", (ev) => {
  // Prevent the button from the default action of taking in the input of the form and redirecting to a new url
  ev.preventDefault();

  // Get all the users from the github-API using AJAX ( pure xhr-request no jQuery or fetch-API used )
  let xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", (event) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // Get the users
      let users = JSON.parse(xhr.responseText);

      // Get the user input elements
      let username = document.querySelector("input#username").value;
      let password = document.querySelector("input#password").value;

      // Check for the user input. See if he can log-in or not
      let user = users.find(
        (user_data) =>
          user_data.login == username && user_data.node_id == password
      );

      if (user == undefined) {
        // Change the h1-title element to display that the user wasn't found. After 5 seconds, get back to the normal "Welcome !" message
        let h1 = document.querySelector("h1#login-title");

        // Keep the text & the color in 2 separate variables so we can set the properties of the title back to normal after displaying the error message
        let h1_backup_color = h1.style.color;
        let h1_backup_text = h1.textContent;

        // Set the color to a red-like color and change the textContent property to display the error message of
        h1.style.color = "#D92534";
        h1.textContent = "Wrong username or password";

        window.setInterval((event) => {
          h1.style.color = h1_backup_color;
          h1.textContent = h1_backup_text;
        }, 5000);
      } else {
        /* 
        When the user logs in we want to :
            * Change the display of the entire login-section to be none
            * Change the display of the user-section to be visible
            * Change the overflow:hidden-style property of the body to be overflow:scroll because the user-section might and will most probably be bigger than the window.innerHeight for most monitors
            * Hide the 4 canvas-animation for the login-section canvas-elements ( set their display to none )
        */

        document.querySelector("section#login-section").style.display = "none";
        document.querySelector("section#user-section").style.display = "block";
        document.querySelector("body").style.overflow = "scroll";

        let canvasAnimationElements = document.getElementsByClassName(
          "animation-canvas"
        );

        for (let i = 0; i < canvasAnimationElements.length; i++) {
          canvasAnimationElements.item(i).style.display = "none";
        }

        // * THE USER LOGGED IN - LOAD THE COOKIES FOR THE USER * //
        loadCookies(user);

        // ********** ADD EVENT LISTENER FOR ALL THE PRODUCTS IN THE section#buy-section **********
        manageBuySection(user);

        // ********** ADD EVENT LISTENER FOR ALL THE PRODUCTS THAT THE USER WANTED TO BUY AND THAT NOW WANTS TO DELETE IN THE div#user-products **********
        manageUserDivBuySection_forDeletion(user);
      }
    }
  });

  xhr.open("GET", "https://api.github.com/users");

  xhr.setRequestHeader("accept", "application/json");
  xhr.send();
});

function loadCookies(user) {
  /*
        The function 'loadCookies' will read the cookies and update the div#user-products-ELEMENT 

        A cookie *MUST* look like this:

        Cookie : 
        key : user.id;
        value : [ [ [data-target-id of product , product-title, img source, price of product, amount of the product that the user wants to buy], ... ,   ], TOTAL_PRICE, TOTAL_AMOUNT_OF_PRODUCTS  ]


    */

  if (document.cookie != new String()) {
    // Find the key in the cookie that matches the user id
    let userCookieString = document.cookie
      .split(";")
      .find((cookieString) => cookieString.split("=")[0].trim() == user.id);

    // GET THE *KEY* & *VALUE* //
    let userCookieStringSplit = userCookieString.split("=");
    let key = userCookieStringSplit[0].trim();
    let value = eval(userCookieStringSplit[1].trim());

    /* Update the number of products & the total price of the products in the section#userProducts-section */
    let number_of_products_element = document.querySelector(
      "p.numberOfProducts"
    );
    number_of_products_element.textContent = `Number of products : ${value[2]}`;

    let total_price_of_products_element = document.querySelector(
      "p.priceOfProducts"
    );
    total_price_of_products_element.textContent = `Price : ${value[1]}$`;
    /* Update the number of products & the total price of the products in the section#userProducts-section */

    /* PUT ALL THE PRODUCTS BOUGHT BY THE USER IN THE div#user-products-ELEMENT*/
    let DIV_USER_PRODUCTS = document.querySelector("div#user-products");

    // First of all, delete all the children of the div#user-products-ELEMENT so we can make a new place for the new ones
    let delete_items = document.querySelectorAll("div#user-products > *");
    for (let i = 0; i < delete_items.length; i++) {
      DIV_USER_PRODUCTS.removeChild(delete_items.item(i));
    }

    // ADD/UPDATE THE PRODUCTS
    value[0].forEach((USER_PRODUCT_LIST) => {
      /*
       * 0 : data-target-id
       * 1 : product-title
       * 2 : img source
       * 3 : price of the product
       * 4 : amount of the product that the user wants to buy
       */

      // Create the big element div
      let PRODUCT_ELEMENT = document.createElement("div");
      PRODUCT_ELEMENT.setAttribute("class", "product");
      PRODUCT_ELEMENT.setAttribute("data-target-id", USER_PRODUCT_LIST[0]);

      // Create the PRODUCT-TITLE
      let product_title_element = document.createElement("p");
      product_title_element.setAttribute("class", "product-title");
      product_title_element.textContent = USER_PRODUCT_LIST[1];

      // Create the PRODUCT-IMAGE
      let product_image_element = document.createElement("img");
      product_image_element.setAttribute("src", USER_PRODUCT_LIST[2]);
      product_image_element.setAttribute("alt", "Product Image");
      product_image_element.setAttribute("class", "product-image");

      // Create the PRODUCT-PRICE ( for all the amount of products of that kind ( so multiply the price with the amount of products of the same type ))
      let product_price_element = document.createElement("p");
      product_price_element.setAttribute("class", "product-price");
      product_price_element.textContent = `${
        USER_PRODUCT_LIST[3] * USER_PRODUCT_LIST[4]
      }$`;

      // Create the PRODUCT-AMOUNT
      let product_amount_element = document.createElement("p");
      product_amount_element.setAttribute("class", "product-amount");
      product_amount_element.textContent = `Amount : ${USER_PRODUCT_LIST[4]}`;

      // ADD EVERYTING INSIDE THE PRODUCT_ELEMENT AND THEN PUT THE PRODUCT ELEMENT INSIDE THE DIV_USER_PRODUCTS //
      PRODUCT_ELEMENT.appendChild(product_title_element);
      PRODUCT_ELEMENT.appendChild(product_image_element);
      PRODUCT_ELEMENT.appendChild(product_price_element);
      PRODUCT_ELEMENT.appendChild(product_amount_element);

      DIV_USER_PRODUCTS.appendChild(PRODUCT_ELEMENT);
    });
    /* PUT ALL THE PRODUCTS BOUGHT BY THE USER IN THE div#user-products-ELEMENT*/
  }
}

function manageBuySection(user) {
  /* Create the USER_PRODUCT_LIST where we will store all the information about the product that the user wants to buy
    The list will look like this (IT MUST MATCH THE COOKIES (look inside 'loadCookies(user)' function for more information about that )):

    USER_PRODUCT_LIST : [
        [
            [data-target-id of product, product-title, img source, price of product, amount of the product that the user wants to buy ],
            [data-target-id of product, product-title, img source, price of product, amount of the product that the user wants to buy ],
        ],
        TOTAL_PRICE,
        TOTAL_AMOUNT_OF_PRODUCTS
    ]

    */
  let USER_PRODUCT_LIST = [[], 0, 0];
  let user_buy_product_elements = document.querySelectorAll(
    "section#buy-section div#products div.product"
  );

  for (let i = 0; i < user_buy_product_elements.length; i++) {
    let PRODUCT_BUY_ELEMENT = user_buy_product_elements.item(i);
    let PRODUCT_SELECTED_BORDER_STYLE = "4px solid rgb(124, 238, 124)";

    PRODUCT_BUY_ELEMENT.querySelector("img.product-image").addEventListener(
      "click",
      () => {
        // If the user clicks on the image of the product, it will select it if it doesn't have the green border around. If it has the green border around it, then that means that the user doesn't need that product anymore, so we will delete it from the USER_PRODUCT_LIST //
        if (PRODUCT_BUY_ELEMENT.style.border != PRODUCT_SELECTED_BORDER_STYLE) {
           ("NEW PRODUCT ~ IT HAS BEEN SELECTED");
          // Get all the information about the product
          let data_target_id = PRODUCT_BUY_ELEMENT.getAttribute(
            "data-target-id"
          );
          let product_title = PRODUCT_BUY_ELEMENT.querySelector(
            "p.product-title"
          ).textContent;
          let img_source = PRODUCT_BUY_ELEMENT.querySelector(
            "img.product-image"
          ).getAttribute("src");
          let product_price = eval(
            PRODUCT_BUY_ELEMENT.querySelector("p.product-price")
              .textContent.split(" ")[0]
              .trim()
          );
          let product_amount = eval(
            PRODUCT_BUY_ELEMENT.querySelector("input.product-amount").value
          );

          // Select the element IF AND ONLY IF the amount in the input.product-amount-ELEMENT is not undefined or null and it's not negative or 0
          if (
            product_amount > 0 &&
            product_amount != undefined &&
            product_amount != null
          ) {
             (PRODUCT_BUY_ELEMENT);
            // Modify the border of the ENTIRE DIV, make it a light green
            PRODUCT_BUY_ELEMENT.style.border = PRODUCT_SELECTED_BORDER_STYLE;

            // Modify the USER_PRODUCT_LIST
            // Change the total price by increasing it with  ( the price of the product * the amount of elements of the product ) //
            USER_PRODUCT_LIST[1] += product_price * product_amount;

            // Change the total amount of products
            USER_PRODUCT_LIST[2] += product_amount;

            // Add the array with the information about the product inside the array
            USER_PRODUCT_LIST[0].push([
              data_target_id,
              product_title,
              img_source,
              product_price,
              product_amount,
            ]);

             (USER_PRODUCT_LIST);
          }
        } else {
           ("PRODUCT ALREADY USED ~ NOT SELECTED ANYMORE NOW");
          // Change the border
          PRODUCT_BUY_ELEMENT.style.border = new String();
          let product_price = eval(
            PRODUCT_BUY_ELEMENT.querySelector("p.product-price")
              .textContent.split(" ")[0]
              .trim()
          );
          let product_amount = eval(
            PRODUCT_BUY_ELEMENT.querySelector("input.product-amount").value
          );

          // Delete the product from the USER_PRODUCT_LIST & modify the price and the total amount of products
          // Find the index of the product-list first
          let index;
          let data_target_id = PRODUCT_BUY_ELEMENT.getAttribute(
            "data-target-id"
          );
          for (let j = 0; j < USER_PRODUCT_LIST[0].length; j++) {
            // Check the data-target-id
            if (USER_PRODUCT_LIST[0][j][0] == data_target_id) {
               ("**** DELETE FOUND ****");
               (USER_PRODUCT_LIST[0][j][0], data_target_id);
              index = j;
              break;
            } else {
              continue;
            }
          }

          // Delete the product-list at the given index
          USER_PRODUCT_LIST[0].splice(index, 1);
           (`data_target_id : ${data_target_id} ~ index : ${index}`);

          // Modify the total price
          USER_PRODUCT_LIST[1] -= product_price * product_amount;
          // Modifyt the total amount
          USER_PRODUCT_LIST[2] -= product_amount;

           (USER_PRODUCT_LIST);
        }
      }
    );
  }

  /* ADD EVENT LISTENER FOR THE *ADD* BUTTON THAT WILL MANAGE THE COOKIES FOR THE SPECIFIC USER WITH THE ***** USER_PRODUCT_LIST ***** */
  document
    .querySelector("button#userAddSection-btn")
    .addEventListener("click", (event) => {
      configureAddCookie(user, USER_PRODUCT_LIST);
    });
}

function manageUserDivBuySection_forDeletion(user) {
  // Store all the items that the user wants to delete in the USER_DELETE_LIST. In the list we will have all the data-target-id of the products that the user wants to delete
  USER_DELETE_LIST = new Array();

  // Add an event listener for all the product-ELEMENTS in the div#user-products -section
  // When the user clicks on the product image that he wants to delete, color the entire border of the product in a red-like color
  let products = document.querySelectorAll("div#user-products div.product");
  let BORDER_COLOR = "4px solid rgb(219, 84, 97)";

  for (let j = 0; j < products.length; j++) {
    let product = products.item(j);

    product
      .querySelector("img.product-image")
      .addEventListener("click", (event) => {
        /* Check if the product has already the border-color. 
                If it has the border-color 4px solid rgb(219, 84, 97) and clicks again on the image, then that means that the user doesn't want to delete the product anymore, so we will toggle the border of the toggle to be nothing again AND delete the data-target-id of the product from the USER_DELETE_LIST.
                Otherwise, add the border-color to the entire product and add the data-target-id of the product in the USER_DELETE_LIST
                */
         ("CLICKED");

        if (product.style.border != BORDER_COLOR) {
          // Add the border to the product
          product.style.border = BORDER_COLOR;

          // Add the product's data-target-id-Attribute to the USER_DELETE_LIST
          USER_DELETE_LIST.push(product.getAttribute("data-target-id"));
        } else {
           ("TOGGLE ITEM, DON'T DELETE IT ANYMORE");
          // Delete the border from the product.style
          product.style.border = new String();

          // Delete the product's data-target-id-Attribute from the USER_DELETE_LIST
          USER_DELETE_LIST.splice(
            USER_DELETE_LIST.indexOf(product.getAttribute("data-target-id")),
            1
          );
        }
      });
  }

  // ADD AN EVENT LISTENER FOR THE DELETE BUTTON //
  document
    .querySelector(
      "section#userProducts-section button#userDeleteBuySection-btn"
    )
    .addEventListener("click", (event) => {
      deleteFromCookie(user, USER_DELETE_LIST);
    });
}

function configureAddCookie(user, USER_PRODUCT_LIST) {
  // Check for the USER_PRODUCT_LIST and make sure it's not the default one and it actually has data from the user in it
  if (USER_PRODUCT_LIST[1] == 0 && USER_PRODUCT_LIST[2] == 0) {
    return;
  }

   ("************* MANAGE COOKIE *************");

   ("USER : ");
   (user);
   ("USER_PRODUCT_LIST : ");
   (USER_PRODUCT_LIST);

   ("************* MANAGE COOKIE *************");

  // Check if the user is in the document-cookie-String or not
  let userCookieString = document.cookie
    .split(";")
    .find((COOKIE_STRING) => COOKIE_STRING.split("=")[0].trim() == user.id);

  // Manage how to use the cookie for both cases : if the user has already a cookie OR when the user doesn't have a cookie
  if (userCookieString != undefined) {
    // Get the key and the value for the given user
    let key = userCookieString.split("=")[0].trim();
    let value = eval(userCookieString.split("=")[1].trim());

    /*
            The value will look like this : [
                [
                    [data-target-id of product, product-title, img source, price of product, amount of the product that the user wants to buy ],
                    [data-target-id of product, product-title, img source, price of product, amount of the product that the user wants to buy ],
                    ...
                ],
                TOTAL_PRICE,
                TOTAL_AMOUNT_OF_PRODUCTS
            ]
        */

    // Delete the user cookie until you swap it with a new one that will include the new items
    document.cookie = `${key}='';path=/;`;

    // Increment the price & the product of the value
    value[1] += USER_PRODUCT_LIST[1];
    value[2] += USER_PRODUCT_LIST[2];

    // Iterate over all the values from USER_PRODUCT_LIST[0] and add it to the value in case that the product-list isn't in the cookie value, otherwise, increment the product amount in the product-list with the new product-amount of the same product from the same product-list
    // Time complexity : O(n^2);
    USER_PRODUCT_LIST[0].forEach((product_list) => {
      // Find out if the product_list data-target-id is already in the value or not. If it is already in the value then modify the amount of the product. Otherwise add the new product_list to the USER_PRODUCT_LIST
      let index = undefined;
      for (let j = 0; j < value[0].length; j++) {
        // Check for the data-target-id
        if (value[0][j][0] == product_list[0]) {
          index = j;
          break;
        } else {
          continue;
        }
      }

      if (index != undefined) {
        value[0][index][4] += product_list[4];
      } else {
        value[0].push(product_list);
      }
    });

    // Modify the value to string
    value = JSON.stringify(value);

    // Add the modified cookie to the document.cookie WITH PATH=/;
    document.cookie = `${key}=${value};path=/`;
  } else {
    // Get the key & the value out of the user cookie
    let key = user.id;
    let value = JSON.stringify(USER_PRODUCT_LIST);

    // Add the new cookie key/value pair to the document.cookie WITH PATH=/;
    document.cookie = `${key}=${value};path=/;`;
  }

  // ****** LOAD THE NEW COOKIES ****** //
  loadCookies(user);
  // ****** LOAD THE NEW COOKIES ****** //
}

function deleteFromCookie(user, USER_DELETE_LIST) {
    // Find the user value in document.cookie
    let key = user.id;
    let value = eval(
    document.cookie.split(";").find((CookieString) => CookieString.split("=")[0].trim() == key).split("=")[1].trim());

    // Delete the current cookie so we can update it later with the new one
    document.cookie = `${key}='';path=/`;

     ("DELETE : ");

    // Update the value list by deleting all the items that have their data-target-id in the USER_DELETE_LIST
    /*
    value : [
        [
            [data-target-id of product, product-title, img source, price of product, amount of the product that the user wants to buy ],
            [data-target-id of product, product-title, img source, price of product, amount of the product that the user wants to buy ],
        ],
        TOTAL_PRICE,
        TOTAL_AMOUNT_OF_PRODUCTS
    ]
    */
     (value[0]);
     (USER_DELETE_LIST);

    /*
    Not working :

    value[0].forEach((product_list, product_list_index) => {
        if(USER_DELETE_LIST.includes(product_list[0])){
            value[2] -= product_list[4];
            value[1] -= product_list[3] * product_list[4];

            value[0].splice(product_list_index, 1);
        }
    });
    */ 

    // Time complexity : O(n^2); The value[0].forEach version didn't work
    USER_DELETE_LIST.forEach((delete_dataTargetID) => {
        for(let i = 0 ; i < value[0].length ; i++){
            if(value[0][i][0] == delete_dataTargetID){
                // Change the total price & the total amount of products
                value[1] -= value[0][i][3] * value[0][i][4];
                value[2] -= value[0][i][4];


                value[0].splice(i, 1);
                break;
            }else{
                continue;
            }
        }
    });

     ("----------------");
     (value[0]);

    // Transform the value to string while still keeping the array-structure
    value = JSON.stringify(value);

    // Update the cookie
    document.cookie = `${key}=${value};path=/`;

    // Update the cookies
    loadCookies(user);

    // Reload the page
    window.location = window.location;
}

// LOG-OUT-BUTTON
document.querySelector("button#user-section-logout-button").addEventListener(
    "click",
    (event) => {
    /*
    When the user wants to log out we:
        * Change the display of the user-section to none
        * Change the display of the login-section to block
        * Empty out the login inputs ( username & password so they are empty for a new user )
        * Empty out the input.product-amount
        * Change the display of all the animation-canvas-ELEMENTS
    */

    // Change display of the 2 big sections
    document.querySelector("section#login-section").style.display = "block";
    document.querySelector("section#user-section").style.display = "none";


    // Empty out the login inputs
    document.querySelector("input#username").value = new String();
    document.querySelector("input#password").value = new String();

    // Empty out the input.product-amount
    let elements = document.querySelectorAll("input.product-amount");
    for(let i = 0 ; i < elements.length ; i++){
        elements.item(i).style.value = new String()
    }

    // animation-canvas-ELEMENTS
    let canvas_elements = document.querySelectorAll("canvas.animation-canvas");
    for(let j = 0 ; j < canvas_elements.length ; j++){
        canvas_elements.item(j).style.display = "block";
    }
});