$(document).ready(function () {
    const form = document.getElementById("program-form");
    const editForm = document.getElementById("edit-program-form");
    const editDialog = document.getElementById("program-edit-dialog");

    if (!form || !editForm || !editDialog) {
        return;
    }

    const storageKey = "gymPrograms";
    const categories = ["strength", "cardio", "group"];
    const defaultPrograms = [
        {
            id: 1,
            name: "Strength Training",
            category: "strength",
            description: "Improve strength and build muscle."
        },
        {
            id: 2,
            name: "Cardio Training",
            category: "cardio",
            description: "Improve endurance and fitness."
        },
        {
            id: 3,
            name: "Group Fitness",
            category: "group",
            description: "Train together with other members."
        },
        {
            id: 4,
            name: "Weight Training",
            category: "strength",
            description: "Develop strength with gym equipment."
        },
        {
            id: 5,
            name: "Cycling",
            category: "cardio",
            description: "An active cardio workout."
        },
        {
            id: 6,
            name: "Group Workout",
            category: "group",
            description: "Join a group training session."
        }
    ];

    let programs = defaultPrograms.map(function (program) {
        return { ...program };
    });

    try {
        const saved = localStorage.getItem(storageKey);

        if (saved !== null) {
            const parsed = JSON.parse(saved);
            const ids = new Set();
            const valid = Array.isArray(parsed) && parsed.every(function (program) {
                if (!program || !Number.isSafeInteger(program.id) ||
                    program.id < 1 || program.id >= Number.MAX_SAFE_INTEGER ||
                    ids.has(program.id) ||
                    typeof program.name !== "string" || !program.name.trim() ||
                    typeof program.description !== "string" || !program.description.trim() ||
                    !categories.includes(program.category)) {
                    return false;
                }

                ids.add(program.id);
                return true;
            });

            if (valid) {
                programs = parsed;
            }
        }
    } catch (error) {
        $("#program-status").text("Saved data could not be loaded. Sample programs are shown.");
    }

    let nextId = programs.reduce(function (maximum, program) {
        return Math.max(maximum, program.id);
    }, 0) + 1;

    let activeCategory = "all";
    $("[data-filter]").removeClass("active").attr("aria-pressed", "false");
    $('[data-filter="all"]').addClass("active").attr("aria-pressed", "true");

    function savePrograms() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(programs));
            return true;
        } catch (error) {
            return false;
        }
    }

    // Search and CRUD use the same programs array.
    function renderPrograms() {
        const container = $("#program-results");
        const searchText = String($("#program-search").val() || "").toLowerCase().trim();
        let visibleCount = 0;
        container.empty();

        programs.forEach(function (program) {
            const matchesSearch = program.name.toLowerCase().includes(searchText) ||
                program.description.toLowerCase().includes(searchText);
            const matchesCategory = activeCategory === "all" ||
                program.category === activeCategory;

            if (!matchesSearch || !matchesCategory) {
                return;
            }

            visibleCount++;
            const column = $("<div>").addClass("col-md-6 col-lg-4 program-column");
            const card = $("<article>")
                .addClass("info-card program-card")
                .attr("data-category", program.category);

            $("<h3>").text(program.name).appendTo(card);
            $("<p>").text(program.description).appendTo(card);
            $("<span>").addClass("badge bg-secondary").text(program.category).appendTo(card);
            column.append(card).appendTo(container);
        });

        $("#program-count").text("Programs found: " + visibleCount);

        if (visibleCount === 0) {
            $("<p>").addClass("col-12 muted").text("No matching programs found.").appendTo(container);
        }
    }

    function renderTable() {
        const tbody = $("#program-table-body").empty();

        programs.forEach(function (program) {
            const row = $("<tr>");
            $("<td>").text(program.id).appendTo(row);
            $("<th>").attr("scope", "row").text(program.name).appendTo(row);
            $("<td>").text(program.category).appendTo(row);
            $("<td>").text(program.description).appendTo(row);

            const actions = $("<td>").appendTo(row);
            const buttons = $("<div>").addClass("program-row-actions").appendTo(actions);

            $("<button>")
                .attr({ type: "button", "data-edit": program.id,
                    "aria-haspopup": "dialog", "aria-controls": "program-edit-dialog" })
                .addClass("btn btn-primary btn-sm")
                .text("Edit")
                .appendTo(buttons);

            $("<button>")
                .attr({ type: "button", "data-delete": program.id })
                .addClass("btn btn-danger btn-sm")
                .text("Delete")
                .appendTo(buttons);

            tbody.append(row);
        });

        if (programs.length === 0) {
            $("<tr>").append(
                $("<td>").attr("colspan", 5).addClass("program-empty")
                    .text("No programs yet. Add your first program above.")
            ).appendTo(tbody);
        }
    }

    function resetForm(targetForm) {
        targetForm.reset();
        $(targetForm).find("input, select, textarea").each(function () {
            this.setCustomValidity("");
        });
    }

    function refreshAfterChange(message) {
        const saved = savePrograms();
        renderTable();
        renderPrograms();
        $("#program-status").text(message + (saved ? "" :
            " Changes could not be saved and will be lost after reload."));
    }

    $("#program-search").on("input", renderPrograms);

    $("[data-filter]").on("click", function () {
        activeCategory = $(this).attr("data-filter");
        $("[data-filter]").removeClass("active").attr("aria-pressed", "false");
        $(this).addClass("active").attr("aria-pressed", "true");
        renderPrograms();
    });

    $(form).add(editForm).find("input, select, textarea").on("input change", function () {
        this.setCustomValidity("");
    });

    function readProgramData(targetForm, prefix) {
        const nameInput = document.getElementById(prefix + "-name");
        const categoryInput = document.getElementById(prefix + "-category");
        const descriptionInput = document.getElementById(prefix + "-description");
        const name = nameInput.value.trim();
        const category = categoryInput.value;
        const description = descriptionInput.value.trim();

        nameInput.setCustomValidity(
            name.length >= 2 && name.length <= 80 ? "" : "Enter a program name of 2–80 characters."
        );
        categoryInput.setCustomValidity(
            categories.includes(category) ? "" : "Choose a category."
        );
        descriptionInput.setCustomValidity(
            description.length > 0 && description.length <= 500 ? "" : "Enter a description of 1–500 characters."
        );

        if (!targetForm.reportValidity()) {
            return null;
        }

        return { name: name, category: category, description: description };
    }

    // Create new records using the page form.
    $(form).on("submit", function (event) {
        event.preventDefault();
        const data = readProgramData(form, "program");

        if (!data) {
            return;
        }

        programs.push({ id: nextId++, ...data });
        resetForm(form);
        refreshAfterChange("Program added.");
    });

    // Edit existing records in a modal dialog.
    $("#program-table-body").on("click", "[data-edit]", function () {
        const id = Number($(this).attr("data-edit"));
        const program = programs.find(function (item) {
            return item.id === id;
        });

        if (!program) {
            return;
        }

        resetForm(editForm);
        $("#edit-program-id").val(program.id);
        $("#edit-program-name").val(program.name);
        $("#edit-program-category").val(program.category);
        $("#edit-program-description").val(program.description);
        editDialog.returnValue = "";
        editDialog.showModal();
    });

    $(editForm).on("submit", function (event) {
        event.preventDefault();
        const data = readProgramData(editForm, "edit-program");

        if (!data) {
            return;
        }

        const id = Number($("#edit-program-id").val());
        const program = programs.find(function (item) {
            return item.id === id;
        });

        if (!program) {
            editDialog.close("deleted");
            $("#program-status").text("Program no longer exists. Add a new program.");
            return;
        }

        program.name = data.name;
        program.category = data.category;
        program.description = data.description;
        refreshAfterChange("Program updated.");
        editDialog.close("saved");
    });

    $("#cancel-edit").on("click", function () {
        editDialog.close("cancelled");
    });

    // Native dialog also closes on Escape and keeps keyboard focus inside while open.
    $(editDialog).on("close", function () {
        const id = Number($("#edit-program-id").val());
        resetForm(editForm);
        $("#edit-program-id").val("");

        if (editDialog.returnValue !== "saved" && editDialog.returnValue !== "deleted") {
            $("#program-status").text("Editing cancelled.");
        }

        const editButton = document.querySelector('[data-edit="' + id + '"]');
        if (editButton) {
            editButton.focus();
        } else {
            document.getElementById("program-name").focus();
        }
    });

    // Delete after confirmation.
    $("#program-table-body").on("click", "[data-delete]", function () {
        const id = Number($(this).attr("data-delete"));

        if (!window.confirm("Are you sure you want to delete this program?")) {
            return;
        }

        programs = programs.filter(function (program) {
            return program.id !== id;
        });

        if (editDialog.open && Number($("#edit-program-id").val()) === id) {
            editDialog.close("deleted");
        }

        refreshAfterChange("Program deleted.");
    });

    renderTable();
    renderPrograms();
});

$(document).ready(function () {
// =====================================
// FORM VALIDATION
// =====================================

function showFeedback(input, feedback, message, valid) {

    $(input).removeClass("is-valid is-invalid");

    if ($(input).val().length === 0 && !message) {
        $(feedback).text("");
        return;
    }

    if (valid) {
        $(input).addClass("is-valid");
    } else {
        $(input).addClass("is-invalid");
    }

    $(feedback).text(message);
}

function validateName() {

    const value = $("#full-name").val().trim();

    const valid = /^[A-Za-zА-Яа-яЁё\s'-]{2,60}$/.test(value);

    showFeedback(
        "#full-name",
        "#name-feedback",
        valid ? "Name looks good." : "Enter a valid name.",
        valid
    );

    return valid;
}

function validateEmail() {

    const value = $("#email").val().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const valid = emailRegex.test(value);

    showFeedback(
        "#email",
        "#email-feedback",
        valid ? "Email is valid." : "Enter a valid email address.",
        valid
    );

    return valid;
}

// PASSWORD STRENGTH

function checkPasswordStrength(password) {

    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (password.length === 0) {
        return "Not entered";
    }

    if (password.length < 8 || score <= 2) {
        return "Weak";
    }

    if (score <= 3) {
        return "Medium";
    }

    return "Strong";
}

function validatePassword() {

    const password = $("#password").val();

    const strength = checkPasswordStrength(password);

    $("#strength-text").text(
        "Password strength: " + strength
    );

    const widths = {
        "Not entered": "0%",
        "Weak": "33%",
        "Medium": "66%",
        "Strong": "100%"
    };

    $("#strength-bar").stop().animate({
        width: widths[strength]
    }, 200);

    $("#strength-bar").attr("data-strength", strength.toLowerCase());

    const valid = password.length >= 8;

    showFeedback(
        "#password",
        "#password-feedback",
        valid ? "Password meets the minimum length." : "Password must contain at least 8 characters.",
        valid
    );

    return valid;
}

// CONFIRM PASSWORD

function validateConfirmPassword() {

    const password = $("#password").val();
    const confirmPassword = $("#confirm-password").val();

    const valid =
        password.length > 0 &&
        confirmPassword.length > 0 &&
        password === confirmPassword;

    showFeedback(
        "#confirm-password",
        "#confirm-feedback",
        valid ? "Passwords match." : "Passwords do not match.",
        valid
    );

    return valid;
}

// MESSAGE

function validateMessage() {

    const value = $("#message").val().trim();

    const valid = value.length >= 5;

    showFeedback(
        "#message",
        "#message-feedback",
        valid ? "Message looks good." : "Message must contain at least 5 characters.",
        valid
    );

    return valid;
}

// REAL-TIME VALIDATION

$("#full-name").on("input", validateName);

$("#email").on("input", validateEmail);

$("#password").on("input", function () {
    validatePassword();

    if ($("#confirm-password").val().length > 0) {
        validateConfirmPassword();
    }
});

$("#confirm-password").on("input", validateConfirmPassword);

$("#message").on("input", validateMessage);

// SUBMIT VALIDATION

$("#registration-form").on("submit", function (event) {

    event.preventDefault();

    const nameValid = validateName();
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    const confirmValid = validateConfirmPassword();
    const messageValid = validateMessage();

    if (
        !nameValid ||
        !emailValid ||
        !passwordValid ||
        !confirmValid ||
        !messageValid
    ) {

        $("#registration-result")
            .removeClass("alert-success")
            .addClass("alert alert-danger")
            .text("Please correct all errors before registration.");

        return;
    }

    $("#registration-result")
        .removeClass("alert-danger")
        .addClass("alert alert-success")
        .text("Registration form validated successfully! Demo only: no data was sent or stored.");

});
});
