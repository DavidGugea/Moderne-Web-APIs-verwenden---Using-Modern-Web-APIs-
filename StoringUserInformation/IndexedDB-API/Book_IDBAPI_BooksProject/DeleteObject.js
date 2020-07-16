let idbFactory = window.indexedDB;
let request = idbFactory.open(
    "TestDatabase",
    9
);

request.onerror = function(event){
    let error = event.target.error;
    console.error(error.message);
}

request.onsuccess = function(event){
    let database = event.target.result;
    let transaction = database.transaction(
        "Books",
        "readwrite"
    );

    let objectStore = transaction.objectStore("Books");
    let request = objectStore.delete("978-3836217408");

    request.onerror = function(event){
        console.error(event.target.error.message);
    }
    request.onsuccess = function(event){
        console.log("One Object Deleted");
    }
}