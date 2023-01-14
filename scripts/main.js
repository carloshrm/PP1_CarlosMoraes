
$("#header_principal > h1").hover(function () {

    $(this).filter(':not(:animated)').animate({
        transform: 360
    }, {
        duration: 300,
        easing: 'linear',
        step: function (now, fx) {
            $(this).css('transform', `rotateX(${now}deg)`);
        }
    });
    $(this).promise().done(function () {
        $(this).css('transform', `rotateX(0deg)`);
    });

});

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


let bdg = document.getElementById("badge");
bdg.innerText = `${randomNum(10000, Number.MAX_SAFE_INTEGER)} cubos de gelo consumidos hoje.`;
