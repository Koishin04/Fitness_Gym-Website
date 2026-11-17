// Apply the saved theme before the page is painted.
(function () {
    const key = "gymTheme";
    let theme = "light";

    function applyTheme(value) {
        theme = value === "dark" ? "dark" : "light";
        document.documentElement.dataset.theme = theme;
        const button = document.getElementById("theme-toggle");
        if (button) {
            button.textContent = theme === "dark" ? "Light mode" : "Dark mode";
            button.setAttribute("aria-pressed", String(theme === "dark"));
        }
    }
    applyTheme(theme);
    document.addEventListener("DOMContentLoaded", function () {
        applyTheme(theme);
        document.getElementById("theme-toggle").addEventListener("click", function () {
            applyTheme(theme === "light" ? "dark" : "light");
        });
    });
})();
