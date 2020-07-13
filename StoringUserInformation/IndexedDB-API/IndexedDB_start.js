let idbFactory = window.indexedDB;
let request = idbFactory.open(
    "TestDatabase", // Name
    1               // Version
);

request.onerror = (event) => {
    let error = event.target.error;
    console.error(error.message);
}

request.onsuccess = function(event){
    let database = event.target.result;

    console.log(database.name);
    console.log(database.version);
}

request.onupgradeneeded = (event) => {
    console.log(event.oldVersion);
    console.log(event.newVersion);
    let database = event.target.result;

    let objectStore = database.createObjectStore(
        "Books",
        {
            keyPath : "isbn"
        }
    );

}