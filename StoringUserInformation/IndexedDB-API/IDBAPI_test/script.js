let db;
let btnCreateDB = document.getElementById("CreateDB");
let btnAddNote = document.getElementById("AddNote");
let btnView = document.getElementById("ViewObj");

btnCreateDB.addEventListener(
    "click",
    (event) => {
        let DB_NAME = document.getElementById("database_name").value;
        let DB_VERSION = document.getElementById("database_version").value;

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = e => alert(`Error : ${e.target.error}`);
        request.onupgradeneeded = e => {
            // Get the DB
            db = e.target.result;

            const obj_store_1 = db.createObjectStore("object_store_1", {
                keyPath : "name"
            });
            const obj_store_2 = db.createObjectStore("object_store_2", {
                keyPath : "name"
            });

            alert(`Upgrade called`);
        }
        request.onsuccess = e => {
            db = e.target.result;

            alert(`Success called`);
        }
    }
);

btnAddNote.addEventListener(
    "click",
    (event) => {
        // Create note
        let obj = {
            name : `Name${Math.floor(Math.random() * 1000) + 5}`,
            value : Math.floor(Math.random() * 100)
        }

        // Build the transaction ( & add event listener for the error )
        let transaction = db.transaction("object_store_1", "readwrite");
        transaction.onerror = e => alert(`Transaction error : ${e.target.error}`);

        // Open up the object store
        let obj_store_1 = transaction.objectStore("object_store_1");

        // Add something inside the object store
        obj_store_1.add(obj);
    }
);

btnView.addEventListener(
    "click",
    (event) => {
        let transaction = db.transaction("object_store_1", "readonly");
        let object_store_1 = transaction.objectStore("object_store_1");

        
        let request = object_store_1.getAll();

        request.onsuccess = e => {
            if(request.readyState == "done"){
                request.result.forEach((obj) => {
                    console.log(`Name : ${obj.name} | Value : ${obj.value}`);
                });
            }
        }
    }
);