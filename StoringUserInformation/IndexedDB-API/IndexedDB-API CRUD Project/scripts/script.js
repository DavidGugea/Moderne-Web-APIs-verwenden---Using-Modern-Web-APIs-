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

        if(!this.checkIf_ID_isUnique(product_ID)){
            // Open up the db & make a transaction to the object store "PRODUCTS" & add all the information in
            let request = window.indexedDB.open("USER_PRODUCTS_IDB", 1);

            request.onsuccess = e => {
                let db = e.target.result;
                let transaction = db.transaction("PRODUCTS", "readwrite");
                let objectStore = transaction.objectStore("PRODUCTS");
                objectStore.add(
                    {
                        "product_name" : product_name.toString(),
                        "product_amount" : product_amount.toString(),
                        "product_price" : product_price.toString(),
                        "product_ID" : product_ID.toString()
                    }
                );
            }
        }else{
            // Display an error message that will show the user that the product_ID that he is trying to use is already in use for another product
            errorMessage("The product_ID property is already in use for another product, try again with another product_ID property and make sure that it won't be in use");
        }
    },
    checkIf_ID_isUnique: function(ID){
        let request = window.indexedDB.open("USER_PRODUCTS_IDB", 1);
        request.onerror = e => console.error(`Error : ${e.target.error}`);

        request.onsuccess = e => {
            // Get the database & make a readonly-transaction and then read the data
            let db = e.target.result;
            let transaction = db.transaction("PRODUCTS", "readonly");
            let objectStore = transaction.objectStore("PRODUCTS");
            let objectStore_request = objectStore.getAllKeys();

            objectStore_request.onsuccess = e => {
                if(objectStore_request.readyState == "done"){
                    // Return if the product_ID has already been used in the objectStore-keys ( since the product_ID is used as the keyPath in the IDB )
                    console.log(objectStore.request.result);
                    return objectStore_request.result.includes(ID);
                }
            }
        }
    }
}


document.addEventListener(
    "DOMContentLoaded",
    manageDB.createIndexedDB
);

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
    console.log(section, errorMessage);

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
        console.log(userInfo.style.display.trim() == "");

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