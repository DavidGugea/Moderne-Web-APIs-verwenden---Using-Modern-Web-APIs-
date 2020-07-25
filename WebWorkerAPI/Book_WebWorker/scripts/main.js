let worker = new Worker("scripts/worker.js");
let message = "Hallo Worker";
console.log(`Hauptthread : Sende Nachricht : ${message}`);
worker.postMessage(message);

worker.addEventListener("message", (event) => {
    console.log(`Hauptthread : Antwort von Worker erhalten: ${event.data}`);
});
worker.addEventListener("error", (event) => {
    console.log("Fehler aufgetreten");
});