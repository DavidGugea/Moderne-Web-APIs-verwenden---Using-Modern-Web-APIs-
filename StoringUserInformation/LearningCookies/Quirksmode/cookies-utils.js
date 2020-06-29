/* https://www.quirksmode.org/js/cookies.html */

function createCookie(name, value, days){
    let expires = new String();
    if(days){
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `;expires=${date.toGMTString()}`;
    }

    document.cookie = `${name}=${value};${expires};path=/`;
}

function readCookie(name){
    let nameEQ = `${name}=`;
    let ca = document.cookie.split(";");

    for(let i = 0 ; i < ca.length ; i++){
        let c = ca[i];
        while(c.charAt(0) == ' ') c = c.substring(1, c.length);
        if(c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
}

function deleteCookie(name){
    createCookie(name, '', -1);
}

$("#createCookie").click(function(ev){
    console.log("test");
    createCookie("test", "1234", 5);
    createCookie("score", "3458345", 10);
    createCookie("firstName", "John");
    createCookie("lastName", "Doe");
});

$("#readCookie").click(function(ev){
    console.log(readCookie("firstName"));
});

$("deleteCookie").click(function(ev){
    deleteCookie("lastName");
});