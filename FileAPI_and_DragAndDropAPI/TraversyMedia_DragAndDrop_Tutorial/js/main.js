const fill = document.querySelector(".fill");
const empties = document.querySelectorAll(".empty");

// Fill Listeners
fill.addEventListener(
    "dragstart",
    dragStart
);
fill.addEventListener(
    "dragend",
    dragEnd
);

// Loop through empties and call drag events
for(const empty of empties){
    empty.addEventListener("dragover", dragOver);
    empty.addEventListener("dragenter", dragEnter);
    empty.addEventListener("dragleave", dragLeave);
    empty.addEventListener("drop", dragDrop);
}

// Drag Functions
function dragStart(event){
    this.className += " hold";

    window.setTimeout(
        () => this.classList.add("invisible"), 0
    );
}

function dragEnd(event){
    this.className = 'fill';
}

function dragOver(event){
    event.preventDefault();

    console.log("Drag Over");
}
function dragEnter(event){
    event.preventDefault();
    this.className += " hovered";

    console.log("Drag Enter");
}
function dragLeave(event){
    this.className = "empty";

    console.log("Drag Leave");
}
function dragDrop(event){
    this.className = "empty";
    this.append(fill);

    console.log("Drag Drop");
}