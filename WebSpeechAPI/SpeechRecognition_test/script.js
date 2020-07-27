const SPEECH_RECOGNITION = window.speechRecognition || window.webkitSpeechRecognition;
const sr = new SPEECH_RECOGNITION();
const mic = document.getElementById("mic");

console.log(sr);

sr.lang = 'en-US';
sr.interimResults = false;
sr.maxAlternatives = 3;
sr.continuous = false;

sr.onresult = (event) => {
    document.getElementById("results").textContent += event.results[0][0].transcript;
}

mic.addEventListener(
    "click",
    (event) => {
        if(mic.classList.contains("on")){
            mic.classList.remove("on");

            let sr_result = sr.stop();
            console.log(sr_result);
        }else{
            mic.classList.add("on");
            sr.start();
        }
    }
)