$(document).ready(function () {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    $(".faq-question").on("click", function () {
        const button = $(this);
        const answer = $("#" + button.attr("aria-controls"));
        const opening = button.attr("aria-expanded") !== "true";
        button.attr("aria-expanded", String(opening));
        button.find(".faq-indicator").text(opening ? "−" : "+");
        answer.stop(true, true).slideToggle(reducedMotion ? 0 : 220);
    });
});
