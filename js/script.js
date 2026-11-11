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
    const form = document.getElementById("registration-form");
    if (!form) return;

    const $form = $(form);
    const $result = $form.find("#registration-result");
    const reducedMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function showFeedback(id, feedbackId, valid, message) {
        $form.find("#" + id)
            .toggleClass("is-valid", valid)
            .toggleClass("is-invalid", !valid)
            .attr("aria-invalid", String(!valid));
        $form.find("#" + feedbackId).text(message).toggleClass("text-danger", !valid);
        return valid;
    }

    function validateName() {
        const value = $form.find("#full-name").val().trim();
        // Unicode letters support names in English, Russian and Kazakh.
        const valid = value.length >= 2 && value.length <= 60 &&
            /^[\p{L}\p{M} '’-]+$/u.test(value) && /\p{L}/u.test(value);
        return showFeedback("full-name", "name-feedback", valid,
            valid ? "Name looks good." : "Enter a name of 2–60 characters using letters, spaces, apostrophes or hyphens.");
    }

    function validateEmail() {
        const value = $form.find("#email").val().trim();
        const valid = value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
        return showFeedback("email", "email-feedback", valid,
            valid ? "Email is valid." : "Enter a valid email address.");
    }

    function validatePassword() {
        const password = $form.find("#password").val();
        const types = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9\s]/]
            .filter(function (pattern) { return pattern.test(password); }).length;
        const level = !password ? 0 : password.length < 8 || types < 2 ? 1 : types < 3 ? 2 : 3;
        const strength = ["Not entered", "Weak", "Medium", "Strong"][level];
        $form.find("#strength-text").text("Password strength: " + strength);
        $form.find(".password-strength").attr({ "aria-valuenow": level, "aria-valuetext": strength });
        $form.find("#strength-bar").attr("data-strength", strength.toLowerCase())
            .stop(true).animate({ width: (level / 3 * 100) + "%" }, reducedMotion ? 0 : 200);
        const valid = password.length >= 8 && password.trim().length > 0;
        return showFeedback("password", "password-feedback", valid,
            valid ? "Password meets the minimum length." : "Use at least 8 characters, not only spaces.");
    }

    function validateConfirmation() {
        const value = $form.find("#confirm-password").val();
        const valid = value.length > 0 && value === $form.find("#password").val();
        return showFeedback("confirm-password", "confirm-feedback", valid,
            valid ? "Passwords match." : "Passwords do not match.");
    }

    function validateMessage() {
        const value = $form.find("#message").val().trim();
        const valid = value.length >= 5 && value.length <= 1000;
        return showFeedback("message", "message-feedback", valid,
            valid ? "Message looks good." : "Enter a message of 5–1000 characters.");
    }

    $form.on("input", "input, textarea", function () {
        $result.removeClass("alert alert-success alert-danger").empty();
    });
    $form.find("#full-name").on("input", validateName);
    $form.find("#email").on("input", validateEmail);
    $form.find("#password").on("input", function () {
        validatePassword();
        if ($form.find("#confirm-password").val() ||
            $form.find("#confirm-password").attr("aria-invalid")) {
            validateConfirmation();
        }
    });
    $form.find("#confirm-password").on("input", validateConfirmation);
    $form.find("#message").on("input", validateMessage);

    $form.on("submit", function (event) {
        event.preventDefault();
        // Run every check so all invalid fields receive feedback at once.
        const checks = [validateName(), validateEmail(), validatePassword(),
            validateConfirmation(), validateMessage()];
        const valid = checks.every(Boolean);
        $result.addClass("alert").toggleClass("alert-success", valid)
            .toggleClass("alert-danger", !valid)
            .text(valid ? "Registration form validated successfully! Demo only: no data was sent or stored." :
                "Please correct all errors before registration.");
        if (!valid) $form.find(".is-invalid").first().trigger("focus");
    });
});

$(document).ready(function () {
    const dialog = document.getElementById("lightbox");
    const $triggers = $(".gallery-trigger");
    if (!dialog || !$triggers.length) return;

    const $dialog = $(dialog);
    const $image = $("#lightbox-image");
    const reducedMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 0 : 160;
    let currentIndex = 0;
    let opener = null;
    let closing = false;

    function showImage(index, animate) {
        currentIndex = (index + $triggers.length) % $triggers.length;
        const $thumbnail = $triggers.eq(currentIndex).find("img");
        const caption = $triggers.eq(currentIndex).closest(".card").find(".card-title").text();
        // Clear the previous animation so rapid navigation always shows the latest selection.
        $image.stop(true, true).attr({ src: $thumbnail.attr("src"), alt: $thumbnail.attr("alt") });
        $("#lightbox-caption").text(caption);
        $("#lightbox-count").text((currentIndex + 1) + " / " + $triggers.length);
        if (animate) $image.hide().fadeIn(duration);
    }

    function closeGallery() {
        if (!dialog.open || closing) return;
        closing = true;
        $dialog.stop(true, true).fadeOut(duration, function () {
            dialog.close();
        });
    }

    $triggers.on("click", function () {
        opener = this;
        closing = false;
        showImage($triggers.index(this), false);
        // Native dialog handles focus trapping and makes the background inert.
        $dialog.stop(true, true).hide();
        dialog.showModal();
        $("body").addClass("gallery-open");
        $dialog.fadeIn(duration);
        document.getElementById("lightbox-close").focus();
    });

    $("#lightbox-prev").on("click", function () { showImage(currentIndex - 1, true); });
    $("#lightbox-next").on("click", function () { showImage(currentIndex + 1, true); });
    $("#lightbox-close").on("click", closeGallery);
    $dialog.on("cancel", function (event) {
        event.preventDefault();
        closeGallery();
    });
    $dialog.on("click", function (event) {
        if (event.target === dialog) closeGallery();
    });
    $dialog.on("keydown", function (event) {
        if (closing) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            showImage(currentIndex + (event.key === "ArrowLeft" ? -1 : 1), true);
        }
    });
    $dialog.on("close", function () {
        $dialog.stop(true, true).css({ display: "", opacity: "" });
        $image.stop(true, true).show();
        $("body").removeClass("gallery-open");
        closing = false;
        if (opener) opener.focus();
    });
});
