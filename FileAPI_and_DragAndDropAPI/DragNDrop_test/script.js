const image = document.getElementById("dragImage");
const boxes = document.querySelectorAll(".box");
function spaceUp(){
    for(let i = 0 ; i < 3 ; i++){
        console.log(" ");
    }

    console.log("-------------------------------");

    for(let i = 0 ; i < 3 ; i++){
        console.log(" ");
    }
}

image.addEventListener(
    "dragstart",
    (event) => {
        console.log(event.target);
        console.log("DRAGSTART");
        spaceUp();
    }
);
image.addEventListener(
    "dragend",
    (event) => {
        console.log(event.target);
        console.log("DRAGEND");
        spaceUp();
    }
);
image.addEventListener(
    "drag",
    (event) => {
        console.log("DRAG");
    }
);
image.addEventListener(
    "dragover",
    (event) => {
        // console.log("DRAG OVER");
    }
);
image.addEventListener(
    "dragenter",
    (event) => {
        console.log(event.target);
        console.log("DRAGENTER");
        spaceUp();
    }
);
image.addEventListener(
    "dragleave",
    (event) => {
        console.log(event.target);
        console.log("DRAGLEAVE");
    }
);