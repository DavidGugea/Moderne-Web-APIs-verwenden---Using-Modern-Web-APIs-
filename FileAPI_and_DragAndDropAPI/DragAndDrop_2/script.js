function handleDragOver(event){
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
}
function handleDrop(event){
    event.stopPropagation();
    event.preventDefault();

    console.dir(event);
    let output = new String();

    for(let i = 0 ; i < event.dataTransfer.files.length ; i++){
        let file = event.dataTransfer.files[i];
        output += `<li>${file.name} ( <strong>${file.type}</strong> ) - > ${file.size} bytes <li - -- > Last modified in -- > ${file.lastModifiedDate.toLocaleDateString()}</li>`;
    }

    document.getElementById("list").innerHTML = output;
}

let div = document.getElementById("target");
div.addEventListener("dragover", handleDragOver);
div.addEventListener("drop", handleDrop);