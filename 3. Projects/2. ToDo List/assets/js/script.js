
$("ul").on("click", "li", function () {
    $(this).toggleClass("markedItem");
});

$("ul").on("click", "li span", function (event) {
    $(this).parent().fadeOut(500, () => {
        $(this).remove();
    });
    event.stopPropagation();
});


$("input[type='text']").on("keypress", function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        var newToDo = $(this).val();
        $(this).val("");
        $("ul").append("<li><span>X</span> " + newToDo + "</li>");
    }
});

$(".fa-plus").on("click", function () {
    $("input[type='text']").fadeToggle();
    $(this).addClass("d-none");
    $(".fa-minus").removeClass("d-none");
});

$(".fa-minus").on("click", function () {
    $("input[type='text']").fadeToggle();
    $(this).addClass("d-none");
    $(".fa-plus").removeClass("d-none");
});