let button = document.getElementById("btn-animate");

button.addEventListener(
    "click",
    (event) => {
        let box = document.querySelector("div.box");
        console.log("Hello World");

        box.animate(
            [
                {
                    backgroundColor : 'white',
                    borderRadius : '0' 
                },
                {
                    backgroundColor : 'red',
                    borderRadius : '50% 0 0 0' 
                },
                {
                    backgroundColor : 'green',
                    borderRadius : '50% 50% 0 0' 
                },
                {
                    backgroundColor : 'blue',
                    borderRadius : '50% 50% 50% 0'
                },
            ],
            {
                duration: 4000,
                iterations: Infinity,
                fill: "forwards"
            }
        );
    }
);