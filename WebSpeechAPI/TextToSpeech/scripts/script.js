/* DOM ELEMENTS */
let rate_range = document.getElementById("rate");
let rate_display = document.getElementById("rangeDisplay");
let pitch_range = document.getElementById("pitch");
let pitch_display = document.getElementById("pitchDisplay");
let USER_TEXTAREA = document.getElementById("userText");
let VOICES = document.getElementById("voices-select");

/* DOM ELEMENTS */

/* VARS */

let RATE_VALUE = rate_range.value || 0.5;
let PITCH_VALUE = pitch_range.value || 0.5;

/* VARS */

/* Changing the textContent of the range-&pitchDisplay when the range-type inputs are moved ( change-eventListener ) */

rate_range.addEventListener(
    "input",
    (event) => {
        rate_display.textContent = `Rate: ${event.target.value}`;
        RATE_VALUE = event.target.value;
    }
);
pitch_range.addEventListener(
    "input",
    (event) => {
        pitch_display.textContent = `Pitch: ${event.target.value}`;
        PITCH_VALUE = event.target.value;
    }
);

// When the dom is loaded, check the values for the range-inputs & display them 
document.addEventListener(
    "DOMContentLoaded",
    (event) => {
        rate_display.textContent = `Rate: ${rate_range.value}`;
        pitch_display.textContent = `Pitch: ${pitch_range.value}`;
    }
);

/* Changing the textContent of the range-&pitchDisplay when the range-type inputs are moved ( change-eventListener ) */

/* TEXT TO SPEECH */

// Get voices
let voices = new Array();

window.speechSynthesis.getVoices().forEach((voice) => {
    let option = document.createElement("option");
    option.setAttribute("data-target-voice-name", voice.name);
    option.setAttribute("data-target-lang", voice.lang);
    option.textContent = `${voice.lang} ( ${voice.name} )`;

    VOICES.add(option);
});

const TEXT_TO_SPEECH = () => {
    // Create SpeechSynthesisUtterance
    let utterance = new window.SpeechSynthesisUtterance();

    // Set up the properties of the utterance
    utterance.rate = RATE_VALUE;
    utterance.pitch = PITCH_VALUE;
    utterance.text = USER_TEXTAREA.value;
    utterance.lang = VOICES.selectedOptions[0].getAttribute("data-target-lang");
    
    let VOICE_FOR_UTTERANCE;

    // Get the voice for the utterance
    for(let i = 0 ; i < voices.length ; i++){
        if(voices[i].name == VOICES.selectedOptions[0].getAttribute("data-target-voice-name")){
            VOICE_FOR_UTTERANCE = voices[i];
            break;
        }else{
            continue;
        }
    }
    
    utterance.voice = VOICE_FOR_UTTERANCE;

    // Finished setting up the utterance, now transform the text to speech
    window.speechSynthesis.speak(utterance);
}

document.querySelector("button#textToSpeech").addEventListener(
    "click",
    TEXT_TO_SPEECH
);

/* TEXT TO SPEECH */