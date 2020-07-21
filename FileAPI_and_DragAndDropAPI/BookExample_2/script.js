function handleFileSelected(event){
	// Get all the files
    let files = event.target.files;
	let ul = document.createElement("ul");
	console.log(files);
	
    for(let i = 0 ; i < files.length ; i++){
		let file = files[i];

		// Create <li> for <ul>
		let li = document.createElement("li");

		// Create the name
		let name = document.createElement("p");
		name.textContent = file.name;

		// Create the type
		let type = document.createElement("p");
		type.textContent = file.type || "unknown";

		// Create the date
		let date = document.createElement("p");
		date.textContent = file.lastModifiedDate.toLocaleDateString();

		// Add all in the <li> and then add the <li> in the <ul>
		li.appendChild(name);
		li.appendChild(type);
		li.appendChild(date);

		ul.appendChild(li);
    }

	// Add the ul to the body
	document.querySelector("body").appendChild(ul);
}

document.getElementById("files").addEventListener(
    "change",
    handleFileSelected,
    false
);
