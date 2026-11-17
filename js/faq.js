$(document).ready(function () {
    $(".faq-question").on("click", function () {
        $("#" + $(this).attr("aria-controls")).slideToggle(220);
    });
});
