// Get the speech_recognition cls
const speech_recognition_cls = window.speechRecognition || window.webkitSpeechRecognition;
const speech_recognition = new speech_recognition_cls();
speech_recognition.lang = "en-US";

// Get dom elements and add click-event-listener for the image
const user_text = document.querySelector("main textarea#userText");
const image = document.querySelector("main img#microphone_img");
image.addEventListener(
    "click",
    (event) => {
        // Toggle
        if(image.classList.contains("on")){
            /*
            -> Delete the 'on' from the class list
            -> Change the mic src
            -> stop the speech_recognition hearing
            */
            image.classList.remove("on");
            image.setAttribute("src", "images/mic_off.gif");
            speech_recognition.stop();
        }else{
            /*
            -> Add the 'on' class to the class list
            -> Change the mic src
            -> start the speech_recognition hearing 
            */
           image.classList.add("on");
           image.setAttribute("src", "images/mic_on.gif")
           speech_recognition.start();
        }
    }
);

// Add event listener for the speech_recognition onresult ( it will fire after the .stop() method )
speech_recognition.onresult = (event) => {
    // Add the event.results[0][0].transcript to the textarea content
    let text = event.results[0][0].transcript;
    user_text.textContent += `\n${text}`;
}