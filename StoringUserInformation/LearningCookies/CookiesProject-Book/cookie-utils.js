/* I didn't use the Quirksmode cookie-utils.js code because it was too hard to understand, so I made my own 3 function with the same parameters that do the same exact thing. */

function createCookie(name, value, days){
    let date = new Date();
    if(days){
        date.setTime(date.getTime() + days*24*60*60*1000);
    }

    document.cookie = `${name}=${value};path=/;expires=${date.toUTCString()};`;
}

function readCookie(name){
    let fullCookieData = document.cookie.split(";").find((cookieData) => cookieData.split("=")[0].trim() == name);
    return fullCookieData == undefined ? undefined : fullCookieData.split("=")[1].trim();
}


function deleteCookie(name){
    document.cookie = `${name}=;path=/;expires=-1`;
}