$(document).ready(function () {

    // SEARCH AND FILTER

    let activeCategory = "all";

    function filterPrograms() {
        const searchText = $("#program-search")
            .val()
            .toLowerCase()
            .trim();

        let visibleCount = 0;

        $("#program-results .program-card").each(function () {

            const programName = $(this).find("h3")
                .text()
                .toLowerCase();

            const programDescription = $(this).find("p")
                .text()
                .toLowerCase();

            const category = $(this).data("category");

            const matchesSearch =
                programName.includes(searchText) ||
                programDescription.includes(searchText);

            const matchesCategory =
                activeCategory === "all" ||
                activeCategory === category;

            if (matchesSearch && matchesCategory) {
                $(this).closest(".program-column").show();
                visibleCount++;
            } else {
                $(this).closest(".program-column").hide();
            }
        });

        $("#program-count").text(
            "Programs found: " + visibleCount
        );
    }

    $("#program-search").on("input", function () {
        filterPrograms();
    });

    $("[data-filter]").on("click", function () {

        activeCategory = $(this).data("filter");

        $("[data-filter]")
            .removeClass("active")
            .attr("aria-pressed", "false");

        $(this)
            .addClass("active")
            .attr("aria-pressed", "true");

        filterPrograms();
    });

});
const initialPrograms = [
    {
        name: "Strength Training",
        category: "strength",
        description: "Improve strength and build muscle."
    },
    {
        name: "Cardio Training",
        category: "cardio",
        description: "Improve endurance and fitness."
    },
    {
        name: "Group Fitness",
        category: "group",
        description: "Train together with other members."
    },
    {
        name: "Weight Training",
        category: "strength",
        description: "Develop strength with gym equipment."
    },
    {
        name: "Cycling",
        category: "cardio",
        description: "An active cardio workout."
    },
    {
        name: "Group Workout",
        category: "group",
        description: "Join a group training session."
    }
];

function renderPrograms() {
    const container = $("#program-results");
    container.empty();

    initialPrograms.forEach(function (program) {

        const column = $("<div>")
            .addClass("col-md-6 col-lg-4 program-column");

        const card = $("<article>")
            .addClass("info-card program-card")
            .attr("data-category", program.category);

        $("<h3>").text(program.name).appendTo(card);
        $("<p>").text(program.description).appendTo(card);

        column.append(card);
        container.append(column);
    });

    filterPrograms();
}

renderPrograms();