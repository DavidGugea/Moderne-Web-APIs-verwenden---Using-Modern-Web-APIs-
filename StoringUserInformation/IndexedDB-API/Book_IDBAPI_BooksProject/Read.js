let idbFactory = window.indexedDB;

let request = idbFactory.open("TestDatabase", 9);

request.onerror = event => {
    let error = event.target.error;
    console.log(error.message);
}

request.onsuccess = event => {
    let database = event.target.result;
    let transaction = database.transaction("Books");
    let objectStore = transaction.objectStore("Books");

    let request = objectStore.get("978-3-8362-5687-2");

    request.onerror = function(event){
        console.log(event.target.error.message);
    }
    request.onsuccess = function(event){
        console.log(request.result);
    }
}
