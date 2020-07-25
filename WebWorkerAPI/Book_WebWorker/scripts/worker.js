self.addEventListener(
    "message",
    (event) => {
        console.log(`Worker: Nachricht erhlaten: ${event.data}`);
        let workerResult = "Hallo Hauptthread";

        console.log(`Worker: Sende Antwort zuruck: ${workerResult}`);
        self.postMessage(workerResult);
    }
);