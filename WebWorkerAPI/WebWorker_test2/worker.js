self.addEventListener("message", (event) => {
    let data = event.data;

    // style -> |        fetch ;   https://jsonplaceholder.typicode.com/posts   ,  https://api.github.com/users                 |
    if(data.split(";")[0].trim() == "fetch"){
        data.split(";")[1].split(",").forEach((link) => {
            link = link.trim();
            let request = new XMLHttpRequest();

            request.onload = (event) => {
                if(request.readyState == 4 && request.status == 200){
                    self.postMessage(
                        JSON.stringify(JSON.parse(request.responseText), null, 5)
                    );
                }
            }

            request.open(
                "GET",
                link
            );
            request.setRequestHeader("Accept", "application/json");
            request.send();
        })
    }
});