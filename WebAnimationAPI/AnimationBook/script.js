'use strict'
function init(){
    let animation = document.getElementById("circle").animate(
        [
            {
                transform: 'scale(2)',
                opacity: 1,
                offset: 0
            },
            {
                transform: 'scale(3)',
                opacity: 0.8,
                offset: 0.3
            },
            {
                transform: 'scale(4)',
                opacity: 0.6,
                offset: 0.6
            },
            {
                transform: 'scale(5)',
                opacity: 0.7,
                offset: 1
            },
        ],
        {
            duration: 4000, // Milliseconds
            easing: 'ease-in-out',
            delay: 10,
            iterations: Infinity,
            fill: "both"
        }
    );

    let buttonPause = document.getElementById("button-pause");
    buttonPause.addEventListener(
        "click",
        (event) => {
            animation.pause();
        }
    );

    let buttonPlay = document.getElementById("button-play");
    buttonPlay.addEventListener(
        "click",
        (event) => {
            animation.play();
        }
    );

    let buttonCancel = document.getElementById("button-cancel");
    buttonCancel.addEventListener(
        "click",
        (event) => {
            animation.cancel();
        }
    );

    let buttonFinish = document.getElementById("button-finish");
    buttonFinish.addEventListener(
        "click",
        (event) => {
            animation.finish();
        }
    );

    let buttonFaster = document.getElementById("button-faster");
    buttonFaster.addEventListener(
        "click",
        (event) => { 
            animation.playbackRate *= 2;       
        }
    );

    let buttonSlower = document.getElementById("button-slower");
    buttonSlower.addEventListener(
        "click",
        (event) => {
            animation.playbackRate /= 2;
        }
    );
}

document.addEventListener(
    "DOMContentLoaded",
    init
);