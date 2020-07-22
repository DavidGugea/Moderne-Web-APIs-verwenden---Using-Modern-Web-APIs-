function handleChange(event){
    let files = event.target.files;
    console.dir(event);
    let reader = new FileReader();

    for(let i = 0 ; i < files.length ; i++){
        let file = files[i];
        let extension = file.name.split(".")[1];
        console.log(extension);

        switch(extension){
            case "txt":
                reader.readAsText(file);

                reader.onload = (event) => {
                    document.getElementById("files-elements").innerHTML += `<p>${event.target.result}</p>`;
                }

                break;
            case "jpeg":
            case "gif":
            case "png":
            case "jpg":
                reader.readAsDataURL(file);

                reader.onload = (event) => {
                    document.getElementById("files-elements").innerHTML += `<img width=500px height=500px src='${event.target.result}'>`;
                }

                break;
        }
    }
}

document.getElementById("files").addEventListener("change", handleChange, false);