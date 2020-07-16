let idbFactory = window.indexedDB;
let request = idbFactory.open(
    "TestDatabase", // Name of DB
    9               // Version of DB
);

let books = [
    {
        "isbn" : "978-3836217408",
        "title" : "Schrodinger programmiert Java",
        "author" : "Philip Ackermann"
    },
    {
        "isbn" : "978-3-8362-5687-2",
        "title" : "Professionell entwickeln mit JavaScript",
        "author" : "Philip Ackermann"
    }
];

request.onerror = event => {
    let error = event.target.error;
    console.error(error.message);
}

request.onsuccess = event => {
    let database = event.target.result;
    let transaction = database.transaction(["Books"], "readwrite"); // Open up the transaction ( with write-access )
    let objectStore = transaction.objectStore("Books"); // Open up the object-store
    books.forEach(function(book){
        objectStore.add(book);
    });
}

request.onupgradeneeded = event => {
    let database = event.target.result;
    let objectStore = database.createObjectStore("Books", {keyPath : 'isbn'});
}
