// Apply the saved theme before the page is painted.
(function () {
    const key = "gymTheme";
    let theme = "light";
    try {
        if (localStorage.getItem(key) === "dark") theme = "dark";
    } catch (_) { /* The toggle still works when storage is unavailable. */ }

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
            const status = document.getElementById("theme-status");
            try {
                localStorage.setItem(key, theme);
                status.textContent = "";
            } catch (_) {
                status.textContent = "Theme changed for this page. Browser storage is unavailable.";
            }
        });
    });
    window.addEventListener("storage", function (event) {
        if (event.key === key || event.key === null) applyTheme(event.newValue);
    });
})();
