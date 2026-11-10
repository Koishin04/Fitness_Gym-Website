$(document).ready(function () {
    const form = document.getElementById("program-form");

    if (!form) {
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
                .attr({ type: "button", "data-edit": program.id })
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

    function resetForm() {
        form.reset();
        $("#program-id").val("");
        $("#form-title").text("Add New Program");
        $("#save-program").text("Save Program");
        $("#cancel-edit").prop("hidden", true);
        $("#program-form input, #program-form select, #program-form textarea").each(function () {
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

    $("#program-form input, #program-form select, #program-form textarea").on("input change", function () {
        this.setCustomValidity("");
    });

    // Create and update.
    $(form).on("submit", function (event) {
        event.preventDefault();

        const id = Number($("#program-id").val());
        const name = $("#program-name").val().trim();
        const category = $("#program-category").val();
        const description = $("#program-description").val().trim();

        document.getElementById("program-name").setCustomValidity(
            name.length >= 2 && name.length <= 80 ? "" : "Enter a program name of 2–80 characters."
        );
        document.getElementById("program-category").setCustomValidity(
            categories.includes(category) ? "" : "Choose a category."
        );
        document.getElementById("program-description").setCustomValidity(
            description.length > 0 && description.length <= 500 ? "" : "Enter a description of 1–500 characters."
        );

        if (!form.reportValidity()) {
            return;
        }

        if (id) {
            const program = programs.find(function (item) {
                return item.id === id;
            });

            if (!program) {
                resetForm();
                $("#program-status").text("Program no longer exists. Add a new program.");
                return;
            }

            program.name = name;
            program.category = category;
            program.description = description;
        } else {
            programs.push({ id: nextId++, name: name, category: category, description: description });
        }

        resetForm();
        refreshAfterChange(id ? "Program updated." : "Program added.");
    });

    // Read the selected record into the edit form.
    $("#program-table-body").on("click", "[data-edit]", function () {
        const id = Number($(this).attr("data-edit"));
        const program = programs.find(function (item) {
            return item.id === id;
        });

        if (!program) {
            return;
        }

        resetForm();
        $("#program-id").val(program.id);
        $("#program-name").val(program.name);
        $("#program-category").val(program.category);
        $("#program-description").val(program.description);
        $("#form-title").text("Edit Program");
        $("#save-program").text("Update Program");
        $("#cancel-edit").prop("hidden", false);
        document.getElementById("program-name").focus();
    });

    $("#cancel-edit").on("click", function () {
        resetForm();
        $("#program-status").text("Editing cancelled.");
        document.getElementById("program-name").focus();
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

        if (Number($("#program-id").val()) === id) {
            resetForm();
        }

        refreshAfterChange("Program deleted.");
    });

    renderTable();
    renderPrograms();
});
