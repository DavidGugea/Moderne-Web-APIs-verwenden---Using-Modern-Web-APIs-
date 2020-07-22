let progress = document.querySelector(".percent");
let reader = new FileReader();

function updateProgress(event){
    if(event.lengthComputable){
        let percentLoaded = Math.round((event.loaded / event.total) / 100);
        if(percentLoaded < 100){
            let percent = `${percentLoaded}%`;
            progress.style.width = percent;
            progress.textContent = percent;
        }
    }
}
function handleError(event){
    switch(event.target.error.code){
        case event.target.error.NOT_FOUND_ERR:
            console.error("Datei wurde nicht gefunden");
            break;
        case event.target.error.NOT_READABLE_ERR:
            console.error("Datei konnte nicht gelesen werden");
            break;
        case event.target.error.ABORT_ERR:
            break;
        default:
            console.error("Unbekannter Fehler");
    };
}
function handleFileSelected(event){
    progress.style.width = '0%';
    progress.textContent = '0%';

    reader = new FileReader();
    reader.readAsBinaryString(event.target.files[0]);

    reader.onprogress = updateProgress;
    reader.onerror = handleError;
    reader.onabort = (event) => {
        console.log("Lesen der Datei abgebrochen");
    };
    reader.onload = (event) => {
        progress.style.width = "100%";
        progress.textContent = "100%";
    }
}

document.getElementById("files").addEventListener("change", handleFileSelected);

function abortRead(){
    reader.abort();
}
document.getElementById("stopLoading").addEventListener("click", abortRead, false);