const image = document.getElementById("dragImage");
const boxes = document.querySelectorAll("main section.box");

image.addEventListener(
    "dragstart",
    dragStart
);
image.addEventListener(
    "dragend",
    dragEnd
);

document.querySelectorAll("section.box").forEach((box) => {
    box.addEventListener("dragenter", dragEnter);
    box.addEventListener("dragleave", dragLeave);
    box.addEventListener("dragover", dragOver);
    box.addEventListener("drop", drop);
});

function dragStart(event){
    console.log(this);

    this.classList.add("hold");
    window.setTimeout(() => this.classList.add("hidden"), 0);

    console.log("DRAG START");
}

function dragEnd(event){
    this.classList.remove("hidden");
}
function drop(event){
    console.log("DROP");
    console.log(this);

    this.classList.remove("hold");

    let hasImageSection = document.querySelector("section.hasImage");
    let image = hasImageSection.querySelector("img#dragImage");
    console.log(hasImageSection);
    this.style.border = new String();
    console.log(this);

    hasImageSection.classList.remove("hasImage");
    this.classList.remove("hidden");
    hasImageSection.removeChild(image);

    this.classList.add("hasImage");
    console.log(image);
    this.appendChild(image);
}
function dragEnter(event){
    console.log(event.target);
    console.log("DRAG ENTER");

    this.classList.add("dashed");
    this.style.border = "4px #f4f4f4 dashed";
}
function dragLeave(event){
    console.log("drag leave");

    this.classList.remove("dashed");
    this.style.border = new String();
}
function dragOver(event){
    event.preventDefault();
    console.log("DRAG OVER");
}