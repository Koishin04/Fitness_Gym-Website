document.addEventListener("DOMContentLoaded", function () {
    const catalog = document.getElementById("exercise-catalog");
    if (!catalog) return;
    const endpoint = "https://wger.de/api/v2/exerciseinfo/?limit=30&language=2";
    const search = document.getElementById("exercise-search");
    const category = document.getElementById("exercise-category");
    const results = document.getElementById("exercise-results");
    const status = document.getElementById("exercise-status");
    const error = document.getElementById("exercise-error");
    const refresh = document.getElementById("exercise-refresh");
    const more = document.getElementById("exercise-more");
    let exercises = [];
    let licenses = [];
    let nextPage = null;
    let loading = false;

    function textElement(tag, text, className) {
        const element = document.createElement(tag);
        element.textContent = text;
        if (className) element.className = className;
        return element;
    }
    function safeLink(url) {
        try {
            const parsed = new URL(url);
            return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : null;
        } catch (_) { return null; }
    }
    function updateCategories() {
        const selected = category.value;
        category.replaceChildren(new Option("All body areas", "all"));
        [...new Set(exercises.map(item => item.category))].sort().forEach(function (name) {
            category.add(new Option(name, name));
        });
        category.value = [...category.options].some(option => option.value === selected) ? selected : "all";
    }
    function render() {
        const query = search.value.toLowerCase().trim();
        const visible = exercises.filter(function (item) {
            return (item.name + " " + item.equipment + " " + item.muscles).toLowerCase().includes(query)
                && (category.value === "all" || item.category === category.value);
        });
        results.replaceChildren();
        visible.forEach(function (item) {
            const card = textElement("article", "", "exercise-card");
            card.append(textElement("span", item.category, "exercise-tag"));
            card.append(textElement("h3", item.name));
            card.append(textElement("p", "Equipment: " + (item.equipment || "Not specified"), "muted"));
            card.append(textElement("p", "Muscles: " + (item.muscles || "Not specified"), "muted"));
            const details = document.createElement("details");
            details.append(textElement("summary", "Exercise instructions"));
            // Render API content as text, never as HTML.
            details.append(textElement("p", item.description || "No English instructions available.", "exercise-description"));
            const credits = textElement("p", "Source: ", "exercise-credit");
            const source = textElement("a", "wger");
            source.href = "https://wger.de/api/v2/exerciseinfo/" + item.id + "/";
            credits.append(source, document.createTextNode(" · " + item.author));
            const license = licenses.find(value => value.id === item.license);
            if (license) {
                credits.append(document.createTextNode(" · "));
                const link = textElement("a", license.short_name);
                const url = safeLink(license.url);
                if (url) link.href = url;
                credits.append(link);
            }
            details.append(credits);
            card.append(details);
            results.append(card);
        });
        if (!visible.length && !loading) {
            results.append(textElement("p", exercises.length
                ? "No matches among loaded exercises. Clear the filters or load more exercises."
                : "No exercises loaded. Use Refresh to try again.", "muted"));
        }
        status.textContent = loading ? "Loading exercises from wger…"
            : visible.length + " matches in " + exercises.length + " loaded English exercises.";
    }
    async function request(url, signal) {
        const response = await fetch(url, {signal: signal, headers: {Accept: "application/json"}});
        const data = await response.json();
        return data;
    }
    async function load(append) {
        if (loading) return;
        const url = append ? nextPage : endpoint;
        if (!url) return;
        loading = true;
        error.textContent = "";
        refresh.disabled = more.disabled = true;
        catalog.setAttribute("aria-busy", "true");
        render();
        try {
            const [data, licenseData] = await Promise.all([
                request(url, undefined),
                licenses.length ? Promise.resolve({results: licenses})
                    : request("https://wger.de/api/v2/license/?limit=100", undefined)
            ]);
            const normalized = data.results.flatMap(function (item) {
                if (!Number.isSafeInteger(item.id) || !Array.isArray(item.translations)) return [];
                const english = item.translations.find(value => value.language === 2 && typeof value.name === "string");
                if (!english) return [];
                return [{
                    id: item.id, name: english.name,
                    category: item.category && typeof item.category.name === "string" ? item.category.name : "Other",
                    equipment: Array.isArray(item.equipment) ? item.equipment.map(value => value.name).join(", ") : "",
                    muscles: Array.isArray(item.muscles) ? item.muscles.map(value => value.name_en || value.name).join(", ") : "",
                    description: typeof english.description_source === "string" ? english.description_source : "",
                    author: english.license_author || item.license_author || "wger contributors",
                    license: english.license
                }];
            });
            if (data.results.length && !normalized.length) throw new Error("No usable English exercise data");
            let validatedNext = null;
            if (data.next) {
                const next = new URL(data.next);
                validatedNext = next.href;
            }
            licenses = licenseData.results;
            exercises = [...new Map((append ? exercises.concat(normalized) : normalized).map(item => [item.id, item])).values()];
            nextPage = validatedNext;
            updateCategories();
        } catch (failure) {
            error.textContent = "Could not load exercises from wger. Check your connection and try again.";
            if (exercises.length) error.textContent += " Previously loaded exercises are still available.";
        } finally {
            loading = false;
            refresh.disabled = more.disabled = false;
            more.hidden = !nextPage;
            catalog.setAttribute("aria-busy", "false");
            render();
        }
    }
    search.addEventListener("input", render);
    category.addEventListener("change", render);
    refresh.addEventListener("click", () => load(false));
    more.addEventListener("click", () => load(true));
    document.getElementById("exercise-clear").addEventListener("click", function () {
        search.value = "";
        category.value = "all";
        render();
        search.focus();
    });
    load(false);
});
