self.addEventListener("message", (event) => {
    let data = event.data;
    console.log("STARTED");

    console.log(data.split(";")[0].trim());

    // style : fetch ;          https://jsonplaceholder.typicode.com/posts
    // style :       fetch ;                    https://api.github.com/users
    if(data.split(";")[0].trim() == "fetch"){
        // Fetch the given link
        let link = data.split(";")[1].trim();
        console.log(link);

        let request = new XMLHttpRequest();

        request.onload = (event) => {
            if(request.status == 200 && request.readyState == 4){
                self.postMessage(
                    JSON.stringify(JSON.parse(request.responseText), null, 2)
                );
            }
        };

        request.open(
            "GET",
            link
        );

        request.setRequestHeader="application/json";
        request.send();
    }
});