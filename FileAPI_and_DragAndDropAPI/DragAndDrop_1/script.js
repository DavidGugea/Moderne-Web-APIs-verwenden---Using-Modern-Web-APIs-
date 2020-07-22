function handleFileSelected(event){
    event.stopPropagation();
    event.preventDefault();
    
    let files = event.dataTransfer.files;
    let output = new String();
    for(let i = 0 ; i < files.length ; i++){
        let file = files[i];
        output += `<li><strong>${file.name}</strong> ( ${file.type || "unknown" } ) - ${file.size} Bytes. Geändert am : ${file.lastModifiedDate.toLocaleDateString()}`;
    }
    document.getElementById("list").innerHTML = output;
}
function handleDragOver(event){
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
}

let dropTarget = document.getElementById("target");
dropTarget.addEventListener("dragover", handleDragOver, false);
dropTarget.addEventListener("drop", handleFileSelected, false);