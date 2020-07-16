let idbFactory = window.indexedDB;
let request = idbFactory.open("TestDatabase", 9);

request.onerror = function(event){
    let error = event.target.error;
    console.error(error.message);
}

request.onsuccess = function(event){
    let database = event.target.result;

    let transaction = database.transaction("Books", "readwrite");
    let objectStore = transaction.objectStore("Books");

    let request = objectStore.get("978-3-8362-5687-2");
    request.onerror = function(event){
        console.error(event.target.error.message);
    }
    request.onsuccess = function(event){
        let book = request.result;
        book.title = "New Title *UPDATED*";

        let requestUpdate = objectStore.put(book);
    }
}