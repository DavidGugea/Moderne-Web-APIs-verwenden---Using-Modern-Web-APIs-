createCookie("username", "Max Mustermann", 7);
createCookie("shoppingCartItemIDs", "id22345,id23445,id65464,id74747,id46646", 7);

showUsername();
showShoppingCart();

function showUsername(){
    let username = readCookie("username");
    document.getElementById("username").textContent = username;
}

function showShoppingCart(){
    let ids = readCookie("shoppingCartItemIDs").split(",");
    let itemsElement = document.getElementById("shopping-cart-items");
    ids.forEach(function(id){
        let item = catalog[id];
        let itemElement = document.createElement("li");
        itemElement.appendChild(document.createTextNode(item.name));
        itemsElement.appendChild(itemElement);
    });

    document.getElementById("shopping-cart-item-count").textContent = ids.length;
}