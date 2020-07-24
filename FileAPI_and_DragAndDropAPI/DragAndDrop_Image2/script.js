const image = document.getElementById("dragImage");
const boxes = document.querySelectorAll("section.box");

boxes.forEach((box) => {
    box.addEventListener("dragover", dragOver);
    box.addEventListener("dragenter", dragEnter);
    box.addEventListener("dragleave", dragLeave);
    box.addEventListener("drop", drop);
});

image.addEventListener(
    "dragstart",
    (event) => {
        window.setTimeout(() => event.target.classList.add("hidden"), 0);
    }
);
image.addEventListener(
    "dragend",
    (event) => {
        event.target.classList.remove("hidden");
    }
);

function dragOver(event){
    event.preventDefault();
}

function dragEnter(event){
    event.target.style.border = "5px #ccc dashed";
}
function dragLeave(event){
    event.target.style.border = new String();
}

function drop(event){
    let sectionHasImage = document.querySelector("section.hasImage");
    let img = sectionHasImage.querySelector("img#dragImage");

    sectionHasImage.classList.remove("hasImage");
    event.target.classList.add("hasImage");

    sectionHasImage.removeChild(img);
    event.target.appendChild(img);

    event.target.style.border = new String();
}