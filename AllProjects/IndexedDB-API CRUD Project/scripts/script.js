const manageDB = {
    createIndexedDB : function(){
        let request = window.indexedDB.open("USER_PRODUCTS_IDB", 1);

        request.onerror = e => console.error(`Error : ${e.target.error}`);
        request.onupgradeneeded = e => {
            // Get the database-object & create the object store
            let db = e.target.result;
            db.createObjectStore("PRODUCTS", {
                keyPath : "product_ID"
            });
        }
    },
    addToDB : function(product_name, product_amount, product_price, product_ID){
        /*
        * IMPORTANT * : the product_ID MUST be unique, so we will first have to read the database and make sure that the product_ID hasn't been used yet
        */
        // Open up the db & make a transaction to the object store "PRODUCTS" & add all the information in & then display the product in the user-table
        let request = window.indexedDB.open("USER_PRODUCTS_IDB", 1);

        request.onsuccess = e => {
            // Add information in the database
            let db = e.target.result;
            let transaction = db.transaction("PRODUCTS", "readwrite");
            let objectStore = transaction.objectStore("PRODUCTS");
            let objectStore_request = objectStore.getAllKeys();
            // Check if the product has already been used or not

            objectStore_request.onsuccess = e => {
                if(objectStore_request.readyState == "done"){
                    // Check if the product id is unique or not ( if it has already been used as the key in the IDB or not)
                    if(!objectStore_request.result.includes(product_ID)){
                        objectStore.add(
                            {
                                "product_name" : product_name.toString(),
                                "product_amount" : product_amount.toString(),
                                "product_price" : product_price.toString(),
                                "product_ID" : product_ID.toString()
                            }
                        );

                        // Display the new product in the user-table
                        manageUserTable.addProduct(product_name, product_amount, product_price, product_ID);
                    }else{
                        // Display an error message that will show the user that the product_ID that he is trying to use is already in use for another product
                        errorMessage("The product_ID property is already in use for another product, try again with another product_ID property and make sure that it won't be in use");
                    }
                }
            }
        }
    },
    updateDB : function(product_ID, input_element){
        let request = window.indexedDB.open("USER_PRODUCTS_IDB", 1);
        request.onsuccess = e => {
            let db = request.result;
            let transaction = db.transaction("PRODUCTS", "readwrite");
            let objectStore = transaction.objectStore("PRODUCTS");

            // Get the current value 
            let value = objectStore.get(product_ID);

            value.onsuccess = e => {
                let modifyProperty = input_element.parentElement.classList.toString().split(" ")[0].trim();
                eval(`e.target.result.${modifyProperty} = input_element.value`);
                objectStore.put(e.target.result);
            }
        }
    },
    deleteFromDB : function(product_ID){
        let request = window.indexedDB.open("USER_PRODUCTS_IDB", 1);

        request.onsuccess = e => {
            let db = e.target.result;
            let transaction = db.transaction("PRODUCTS", "readwrite");
            let objectStore = transaction.objectStore("PRODUCTS");

            // Delete the item with the given product_ID
            objectStore.delete(product_ID);
        }
    }
}

const manageUserTable = {
    addProduct: function(product_name, product_amount, product_price, product_ID){
        // Get the table tbody
        let table_body = document.querySelector("table#products tbody");
        // Create the table row ( tr )
        let product_tableRow = document.createElement("tr");
        product_tableRow.setAttribute("class", "userProduct");
        product_tableRow.setAttribute("data-target-id", product_ID);
        
        /*
        *NOTE*
        * Create in each td ( table data ) where we should have product_name, product_amount & product_price a input with the attribute "disabled" so that the user will be able to modify the value inside the input once he will press the update_icon ( we can't change the product_ID, so the product_ID won't be inside an input )
        * Set the value-attribute of the inputs-elements to the actual value of the properties ( price, amount, name ) so that the user can see the values
        */

        /* PRODUCT_ID */
        let productID_td = document.createElement("td");
        productID_td.setAttribute("class", "product_ID");
        productID_td.textContent = product_ID;

        /* PRODUCT_NAME */
        let productName_td = document.createElement("td");
        productName_td.setAttribute("class", "product_name");

        let productName_disabled_input = document.createElement("input");
        productName_disabled_input.setAttribute("disabled", new String());
        productName_disabled_input.setAttribute("value", product_name);

        productName_td.appendChild(productName_disabled_input);

        /* PRODUCT_PRICE */
        let productPrice_td = document.createElement("td");
        productPrice_td.setAttribute("class", "product_price");

        let productPrice_disabled_input = document.createElement("input");
        productPrice_disabled_input.setAttribute("disabled", new String());
        productPrice_disabled_input.setAttribute("value", product_price);

        productPrice_td.appendChild(productPrice_disabled_input);

        /* PRODUCT_AMOUNT */
        let productAmount_td = document.createElement("td");
        productAmount_td.setAttribute("class", "product_amount");

        let productAmount_disabled_input = document.createElement("input");
        productAmount_disabled_input.setAttribute("disabled", new String());
        productAmount_disabled_input.setAttribute("value", product_amount);

        productAmount_td.appendChild(productAmount_disabled_input);

        /* PRODUCT UPDATE ICON */
        let productUpdate_td = document.createElement("td");

        let productUpdate_icon = document.createElement("img");
        productUpdate_icon.setAttribute("src", "images/update.jpeg");
        productUpdate_icon.setAttribute("alt", "Update Icon");
        productUpdate_icon.setAttribute("class", "productUpdateIcon");

        // Add click-event-listener for the update icon
        productUpdate_icon.addEventListener(
            "click",
            (event) => {
                this.userUpdateItem(product_ID);
            }
        );

        productUpdate_td.appendChild(productUpdate_icon);

        /* PRODUCT DELETE ICON */
        let productDelete_td = document.createElement("td");

        let productDelete_icon = document.createElement("img");
        productDelete_icon.setAttribute("src", "images/delete.png");
        productDelete_icon.setAttribute("alt", "Delete Icon");
        productDelete_icon.setAttribute("class", "productDeleteIcon");

        // Add click-event-listener for the delete icon
        productDelete_icon.addEventListener("click", this.userDeleteItem);
        productDelete_icon.addEventListener(
            "click",
            (event) => {
                this.userDeleteItem(product_ID);
            }
        );

        productDelete_td.appendChild(productDelete_icon);

        // Add everything to the product table row
        product_tableRow.appendChild(productID_td);
        product_tableRow.appendChild(productName_td);
        product_tableRow.appendChild(productPrice_td);
        product_tableRow.appendChild(productAmount_td);
        product_tableRow.appendChild(productUpdate_td);
        product_tableRow.appendChild(productDelete_td);

        table_body.appendChild(product_tableRow);
    }, 
    userUpdateItem: function(product_ID){
        // Get the table row in the tbody that has the given product_ID
        let tr = document.querySelector(`tr[data-target-id='${product_ID}']`);

        // *TOGGLE* the 'disabled' attribute & the 'inputInUse' class & the type ( number || text ) from all the inputs
        let inputs = tr.querySelectorAll("input").forEach((input) => {
            if(!input.classList.contains("inputInUse")){
                input.removeAttribute("disabled");
                input.classList.add("inputInUse");
                // Only if the input parent ( the <td> ( table data ) ) doesn't represent the product name
                if(!input.parentElement.classList.contains("product_name")){
                    input.setAttribute("type", "number");
                }

                input.addEventListener(
                    "keypress",
                    (event) => {
                        if(event.key == "Enter"){
                            // Toggle disabled attribute & remove class & change type to text
                            input.setAttribute("disabled", new String());
                            input.classList.remove("inputInUse");
                            input.setAttribute("type", "text");

                            // Update the object store with a new value
                            manageDB.updateDB(product_ID, event.target);
                        }
                    }
                )
            }else{
                input.setAttribute("disabled", new String());
                input.classList.remove("inputInUse");
                input.setAttribute("type", "text");
            }
        });
    },
    userDeleteItem: function(product_ID){
        if(typeof product_ID == 'string'){
            // Delete the tr from the table body that has the given ID
            let tbody = document.querySelector("tbody");
            let tr = document.querySelector(`tr[data-target-id='${product_ID}']`);

            tbody.removeChild(tr);

            // Delete it from the DB
            manageDB.deleteFromDB(product_ID);
        }
    }
}

document.addEventListener(
    "DOMContentLoaded",
    manageDB.createIndexedDB
);

// Add event listener when the dom is loaded, the user will be able to see all the products from the IDB in the table
document.addEventListener(
    "DOMContentLoaded",
    (event) => {
        let db = window.indexedDB.open("USER_PRODUCTS_IDB", 1);

        db.onsuccess = e => {
            let idb = e.target.result;
            // Make sure the db has object stores ( is not empty )
            if(idb.objectStoreNames.length != 0){
                let transaction = idb.transaction("PRODUCTS", "readonly");
                let objectStore = transaction.objectStore("PRODUCTS");
                let objectStore_request = objectStore.getAll();

                objectStore_request.onsuccess = e => {
                    if(objectStore_request.readyState == "done"){
                        e.target.result.forEach((obj) => {
                            manageUserTable.addProduct(obj.product_name, obj.product_amount, obj.product_price, obj.product_ID);
                        });
                    }
                }
            }
        }
    }
)

// Add event listener for the create button
document.getElementById("btnCreate").addEventListener(
    "click",
    (event) => {
        // Get the user info from the inputs
        let productName = document.getElementById("productName").value;
        let productAmount = document.getElementById("productAmount").value;
        let productPrice = document.getElementById("productPrice").value;
        let productID = document.getElementById("productID").value;

        // Add all the user data to the IDB
        manageDB.addToDB(productName, productAmount, productPrice, productID);
    }
);

// Make the function that will display error message to the user
function errorMessage(message){
    // Change the display of the section#userError to block and change the textContent of the p#errorMessage to be the passed in message in the argument and then after 5 seconds ( after the user has read the error message ) change all to default
    let section = document.getElementById("userError");
    let errorMessage = document.getElementById("errorMessage");

    section.style.display = "block";
    errorMessage.textContent = message;

    window.setTimeout(
        function(){
            section.style.display = "none";
            errorMessage.textContent = new String();
        },
        5000
    );
}

// Add event listener for the question mark button that will display helpful information for the user by toggling the display-CSS-property of the div#userInfo element
document.querySelector("section#userHelp img").addEventListener(
    "click",
    function(event){
        let userInfo = document.getElementById("userInfo");

        // Toggle display 
        switch(userInfo.style.display.trim()){
            case "":
            case new String():
            case "none":
                userInfo.style.display = "block";
                break;
            case "block":
                userInfo.style.display = "none";
                break;
        }
    }
);