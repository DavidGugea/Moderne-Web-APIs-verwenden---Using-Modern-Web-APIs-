$("#addCookie").click(function(ev){
    let key = $("#addCookie_input_key").val();
    let value = $("#addCookie_input_value").val();

    let thirty = 60 * 60 * 24 * 30; // 30 days
    let date = new Date(); date.setHours(date.getHours() + 5); 

    document.cookie = `${key}=${value};path=/;max-age=${thirty};expires=${date}`;
});

$("#deleteCookie").click(function(ev){
    let key = $("#deleteCookie_input_key").val();

    let thirty = 60 * 60 * 24 * 30; // 30 days
    let date = new Date(); date.setHours(date.getHours() + 5);

    document.cookie= `${key}=;path=/;max-age=${thirty};expires=${date}`;
});

$("#checkCookie").click(function(ev){
    let key = $("#checkCookie_input_key").val();
    let value = document.cookie.split(";").find((cookieValue) => cookieValue.split("=")[0].trim() == key);

    $("#cookieFound").css({
        "background-color": "black",
        "color" : "white",
        "padding" : "5px",
        "font-family" : "cursive",
        "border": "2px solid white"
    });
    $("#cookieFound").text(value.trim());
});

$("#seeFullCookie").click((ev) => $("#fullCookie").text(document.cookie.split(";").map(val => val.trim()).reduce((accumulator, value, valueIndex, defaultValue) => ( valueIndex == defaultValue.length - 1 ? accumulator+=`${value}` : accumulator+=`${value};`, accumulator),new String())));
