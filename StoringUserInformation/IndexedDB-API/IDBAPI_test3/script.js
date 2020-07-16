let db;

document.getElementById("createDB").addEventListener(
    "click",
    (event) => {
        let DB_NAME = document.getElementById("DB_NAME").value;
        let DB_VERSION = eval(document.getElementById("DB_VERSION").value);

        let request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = e => alert(`Request DB create error -- > ${e.target.error}`);

        request.onupgradeneeded = e => {
            alert("Upgradeneeded called");
            db = e.target.result;
            db.createObjectStore("users", { keyPath : "username" });
        }
        request.onsuccess = e => {
            alert("Success called");
            db = e.target.result;
        } 
    }
);

document.getElementById("addUser").addEventListener(
    "click",
    (event) => {
        let transaction = db.transaction("users", "readwrite");
        let object_store = transaction.objectStore("users");

        let user = {
            username : `Username${Math.floor(Math.random() * 10000) + 1}`,
            password : `Password${Math.floor(Math.random() * 10000) + 1}`
        }

        object_store.add(user);
    }
);

document.getElementById("viewUsers").addEventListener(
    "click",
    (event) => {
        let transaction = db.transaction("users", "readonly");
        let object_store = transaction.objectStore("users");

        /*
        let request = object_store.getAll();
        request.onerror = e => alert(`Request view users error -- > ${e.target.error}`);

        request.onsuccess = e => {
            if(request.readyState == "done"){
                request.result.forEach((user) => {
                    console.log(`Username : ${user.username} ; Password : ${user.password}`);
                });
            }
        }
        */

        let request = object_store.openCursor();

        request.onerror = e => alert(`Request view users error -- > ${e.target.error}`);

        request.onsuccess = e => {
            let i = 0;
            if(request.readyState == "done"){
                let cursor = request.result; // IDBCursorWithValue
                if(cursor){
                    console.log(`Username : ${cursor.value.username} ; Password : ${cursor.value.password}`);
                    cursor.continue();
                }
            }
        }
    }
);