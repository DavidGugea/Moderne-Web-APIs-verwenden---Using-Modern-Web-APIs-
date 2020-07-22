function handleFileSelected(event){
    let files = event.target.files;
    for(let i = 0 ; i < files.length ; i++){
        let file = files[i];
        let reader = new FileReader();

        if(file.type.match("text.*")){
            reader.readAsText(file);

            reader.onload = (event) => {
                let span = document.createElement("span");
                span.innerHTML = reader.result;
                document.getElementById("list").insertBefore(span, null);
            };
        }else if(file.type.match("image.*")){
            reader.readAsDataURL(file);

            reader.onload = (event) => {
                let span = document.createElement("span");
                span.innerHTML = `<img src='${reader.result}'/>`;
                document.getElementById("list").insertBefore(span, null);
            }
        }
    }
}

document.getElementById("files").addEventListener("change", handleFileSelected, false);