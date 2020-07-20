function handleFileSelected(event){
    let files = event.target.files;
    console.log(files);
    let output = new String();

    for(let i = 0 ; i < files.length ; i++){
        let file = files[i];
        console.log(file);
        console.log(typeof file);
        output += `<li><strong>${file.name}</strong> ( ${file.type} ) - ${file.size} Byes, geandert am : ${file.lastModifiedDate.toLocaleDateString()}`;
    }

    document.getElementById("list").innerHTML = `<ul>${output}</ul>`;
}

document.getElementById("files").addEventListener(
    "change",
    handleFileSelected,
    false
);