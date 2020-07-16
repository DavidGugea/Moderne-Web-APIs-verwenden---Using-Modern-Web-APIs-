let btnCreate = document.getElementById("createDB");
let btnAddNote = document.getElementById("addNote");
let btnView = document.getElementById("viewNotes");
let db;

btnCreate.addEventListener(
    "click",
    (event) => {
        let DB_NAME = document.getElementById("DB_NAME").value;
        let DB_VERSION = document.getElementById("DB_VERSION").value;

        let request = indexedDB.open(
            DB_NAME,
            DB_VERSION
        );

        request.onerror = e => alert(`Error : ${e.target.result}`);
        request.onsuccess = e => {
            alert("Success is called");
            console.log(e.target.result);

            db = e.target.result;
        }
        request.onupgradeneeded = e => {
            alert("Upgrade is called");
            createObjectStores(e);

            db = e.target.result;
        }
    }
);
btnAddNote.addEventListener(
    "click",
    (event) => {
        let note = {
            Name : `Name${Math.floor(Math.random() * 1000)}`,
            Value : `Value${Math.floor(Math.random() * 1000)}`
        }

        let transaction = db.transaction("DB_NOTES", "readwrite");
        transaction.onerror = e => alert(`Transaction error -- > ${e.target.result}`);

        let obj_store = transaction.objectStore("DB_NOTES");
        obj_store.add(note);
    }
);
btnView.addEventListener(
    "click",
    (event) => {
        let transaction = db.transaction("DB_NOTES", "readonly");
        let obj_store=  transaction.objectStore("DB_NOTES");
        let idb_request = obj_store.openCursor();

        idb_request.onerror = e => alert(`IDBRequest -- > ${e.target.result}`);
        idb_request.onsuccess = e => {
            if(idb_request.readyState == "done"){
                let IDBCursorWithValue_obj = e.target.result;
                if(IDBCursorWithValue_obj){
                    console.log(`${IDBCursorWithValue_obj.value.Name} | ${IDBCursorWithValue_obj.value.Value}`);

                    IDBCursorWithValue_obj.continue();
                }
            }
        }

        /* 
        ----------------------- OR -----------------------
        let request = obj_store.getAll();

        request.onerror = e => alert(`Request object store error -- > ${e.target.result}`);
        request.onsuccess = e => {
            if(request.readyState == "done"){
                request.result.forEach((obj) => {
                    console.log(`${obj.Name} | ${obj.Value}`);
                });
            }
        }
        */
    }
);

function createObjectStores(e){
    let result = e.target.result;
    console.log(db);

    result.createObjectStore("DB_NOTES", { keyPath : "Name"});
    result.createObjectStore("DB_NOTES_2", { keyPath : "Value"});
}