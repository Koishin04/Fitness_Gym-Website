// A browser-local sign-in demonstration. No password is saved or sent.
document.addEventListener("DOMContentLoaded", function () {
    const key = "gymSession";
    const dialog = document.getElementById("sign-in-dialog");
    const form = document.getElementById("sign-in-form");
    const openButton = document.getElementById("sign-in-open");
    const signOut = document.getElementById("sign-out");
    const notice = document.getElementById("account-status");
    const nameInput = document.getElementById("login-name");
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    let session = null;

    function readSession() {
        try {
            const saved = JSON.parse(localStorage.getItem(key));
            return saved && saved.signedIn === true && typeof saved.name === "string"
                && saved.name.trim().length >= 2 && saved.name.length <= 60 ? saved : null;
        } catch (_) { return null; }
    }
    function renderSession() {
        openButton.hidden = Boolean(session);
        document.getElementById("member-controls").hidden = !session;
        document.getElementById("member-name").textContent = session ? "Hi, " + session.name : "";
        document.querySelectorAll("[data-member-welcome]").forEach(function (element) {
            element.hidden = !session;
            element.querySelector("[data-member-name]").textContent = session ? session.name : "";
        });
    }
    function validate(input, message) {
        const invalid = Boolean(message);
        input.setAttribute("aria-invalid", String(invalid));
        input.classList.toggle("is-invalid", invalid);
        document.getElementById(input.id + "-error").textContent = message;
        return !invalid;
    }
    function checkName() {
        const value = nameInput.value.trim();
        return validate(nameInput, value.length >= 2 && value.length <= 60
            && /^[\p{L}\p{M} '\-]+$/u.test(value) && /\p{L}/u.test(value)
            ? "" : "Enter a name with 2–60 characters using letters, spaces, apostrophes or hyphens.");
    }
    function checkEmail() {
        const value = emailInput.value.trim();
        return validate(emailInput, value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
            ? "" : "Enter a valid email address.");
    }
    function checkPassword() {
        return validate(passwordInput, passwordInput.value.length >= 8 && passwordInput.value.trim()
            ? "" : "Enter at least 8 characters. Use a sample password for this demo.");
    }
    nameInput.addEventListener("input", checkName);
    emailInput.addEventListener("input", checkEmail);
    passwordInput.addEventListener("input", checkPassword);
    openButton.addEventListener("click", function () {
        form.reset();
        [nameInput, emailInput, passwordInput].forEach(input => validate(input, ""));
        document.getElementById("sign-in-status").textContent = "";
        dialog.showModal();
        nameInput.focus();
    });
    document.getElementById("sign-in-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", function () {
        form.reset();
        (session ? signOut : openButton).focus();
    });
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (![checkName(), checkEmail(), checkPassword()].every(Boolean)) {
            form.querySelector('[aria-invalid="true"]').focus();
            return;
        }
        const candidate = {signedIn: true, name: nameInput.value.trim()};
        try {
            localStorage.setItem(key, JSON.stringify(candidate));
        } catch (_) {
            document.getElementById("sign-in-status").textContent = "Sign-in needs browser storage. Allow it and try again.";
            return;
        }
        session = candidate;
        renderSession();
        notice.textContent = "Signed in to the demo on this browser.";
        dialog.close();
    });
    signOut.addEventListener("click", function () {
        try {
            localStorage.removeItem(key);
        } catch (_) {
            notice.textContent = "Could not clear the saved sign-in. Allow browser storage and try again.";
            return;
        }
        session = null;
        renderSession();
        notice.textContent = "You have signed out.";
        openButton.focus();
    });
    window.addEventListener("storage", function (event) {
        if (event.key === key || event.key === null) {
            session = readSession();
            renderSession();
            notice.textContent = "Sign-in state updated from another tab.";
            if (dialog.open) dialog.close();
        }
    });
    session = readSession();
    renderSession();
});
