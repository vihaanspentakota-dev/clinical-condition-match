/* ===========================================================
   API CONFIGURATION
   Point this at whatever symptom-checking API you're running.
   The included app.py (Flask) is a reference implementation that
   matches this contract, but any backend returning a similar
   JSON shape will work without touching the rest of this file.
=========================================================== */
const API_CONFIG = {
    baseUrl: "http://127.0.0.1:5000", // e.g. "https://api.yoursite.com"
    endpoint: "/check",               // appended to baseUrl
    queryParam: "symptoms",           // comma-separated symptom string
};

// Expected response: an array of objects, each describing a possible
// condition. Only `condition` is required — everything else is optional
// and will be used automatically if present:
//   { condition: "Common Cold", matches: 4, confidence: 72,
//     description: "...", matchedSymptoms: ["cough", "fatigue"] }

function buildRequestUrl(symptoms) {
    const url = new URL(API_CONFIG.endpoint, API_CONFIG.baseUrl);
    url.searchParams.set(API_CONFIG.queryParam, symptoms);
    return url.toString();
}

async function fetchResults(symptoms) {
    const response = await fetch(buildRequestUrl(symptoms));

    if (!response.ok) {
        throw new Error("API responded with status " + response.status);
    }

    return response.json();
}

/* ===========================================================
   UI wiring
=========================================================== */
const input = document.getElementById("symptomInput");
const button = document.getElementById("checkButton");
const resultsList = document.getElementById("resultsList");
const resultsMeta = document.getElementById("resultsMeta");
const chipRow = document.getElementById("chipRow");

const EMPTY_STATE_HTML = `
    <div class="empty-state">
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <rect x="10" y="6" width="28" height="36" rx="3" stroke="currentColor" stroke-width="2"/>
            <path d="M17 16h14M17 23h14M17 30h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="33" cy="34" r="8" fill="var(--color-bg)" stroke="currentColor" stroke-width="2"/>
            <path d="M33 31v3l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>Your results will appear here once you check your symptoms.</p>
    </div>
`;

chipRow.addEventListener("click", function (event) {
    const chip = event.target.closest(".chip");
    if (!chip) return;

    const symptom = chip.dataset.symptom;
    const current = input.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const isActive = chip.classList.toggle("active");

    if (isActive) {
        if (!current.includes(symptom)) current.push(symptom);
    } else {
        const idx = current.indexOf(symptom);
        if (idx !== -1) current.splice(idx, 1);
    }

    input.value = current.join(", ");
    input.focus();
});

button.addEventListener("click", handleCheckSymptoms);
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        handleCheckSymptoms();
    }
});

async function handleCheckSymptoms() {
    const symptoms = input.value.trim();

    if (symptoms === "") {
        renderStatus("Please enter at least one symptom to continue.", "error");
        input.focus();
        return;
    }

    setLoading(true);
    renderSkeleton();

    try {
        const raw = await fetchResults(symptoms);
        const results = normalizeResults(raw);
        renderResults(results);
    } catch (error) {
        renderStatus(
            "Could not reach the symptom-checking API. Confirm it's running and that API_CONFIG in script.js points to the right address.",
            "error"
        );
        resultsMeta.textContent = "";
    } finally {
        setLoading(false);
    }
}

function setLoading(isLoading) {
    button.disabled = isLoading;
    button.classList.toggle("is-loading", isLoading);
    button.querySelector(".btn-label").textContent = isLoading
        ? "Analyzing symptoms…"
        : "Check Symptoms";
}

function renderSkeleton() {
    resultsMeta.textContent = "";
    resultsList.innerHTML = `
        <div class="skeleton-grid">
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
        </div>
    `;
}

function normalizeResults(raw) {
    if (!Array.isArray(raw)) return [];

    const list = raw.map((item) => ({
        condition: item.condition || item.name || "Unknown condition",
        matches: typeof item.matches === "number" ? item.matches : null,
        confidence: typeof item.confidence === "number" ? item.confidence : null,
        description: item.description || null,
        matchedSymptoms: Array.isArray(item.matchedSymptoms)
            ? item.matchedSymptoms
            : Array.isArray(item.symptoms)
            ? item.symptoms
            : null,
    }));

    const maxMatches = Math.max(1, ...list.map((r) => r.matches || 0));

    list.forEach((r) => {
        if (r.confidence === null) {
            r.confidence = r.matches !== null
                ? Math.round((r.matches / maxMatches) * 100)
                : null;
        }
    });

    return list.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
}

function renderResults(results) {
    if (results.length === 0) {
        resultsMeta.textContent = "";
        resultsList.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <circle cx="24" cy="20" r="14" stroke="currentColor" stroke-width="2"/>
                    <path d="M34 30l9 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <p>No close matches found. Try describing your symptoms differently or adding more detail.</p>
            </div>
        `;
        return;
    }

    const MAX_VISIBLE = 9;
    const visible = results.slice(0, MAX_VISIBLE);

    resultsMeta.textContent =
        results.length > MAX_VISIBLE
            ? `Showing top ${MAX_VISIBLE} of ${results.length} possible matches`
            : results.length === 1
            ? "1 possible match"
            : results.length + " possible matches";

    resultsList.innerHTML = visible
        .map((result, index) => {
            const confidence = result.confidence !== null ? result.confidence : 0;
            const confidenceLabel = result.confidence !== null ? confidence + "%" : "—";

            const matchedBlock = result.matchedSymptoms && result.matchedSymptoms.length
                ? `
                    <p class="matched-label">Because you mentioned</p>
                    <div class="matched-chips">
                        ${result.matchedSymptoms
                            .map((s) => `<span class="matched-chip">${escapeHtml(s)}</span>`)
                            .join("")}
                    </div>
                `
                : result.matches !== null
                ? `<p class="matched-label">${result.matches} matching symptom${result.matches === 1 ? "" : "s"}</p>`
                : "";

            return `
                <article class="result-card" style="animation-delay:${index * 60}ms">
                    <span class="result-rank">#${index + 1}</span>
                    <h3 class="result-condition">${escapeHtml(result.condition)}</h3>
                    ${result.description ? `<p class="result-summary">${escapeHtml(result.description)}</p>` : ""}
                    <div class="confidence-row">
                        <span>Match strength</span>
                        <span>${confidenceLabel}</span>
                    </div>
                    <div class="confidence-track">
                        <div class="confidence-fill" style="width:${confidence}%"></div>
                    </div>
                    ${matchedBlock}
                </article>
            `;
        })
        .join("");
}

function renderStatus(message, type) {
    const iconError = `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 9v4M12 16.5h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M10.3 3.9 1.8 18.5A2 2 0 0 0 3.5 21.5h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        </svg>
    `;

    resultsList.innerHTML = `
        <div class="status-state ${type === "error" ? "is-error" : ""}">
            ${iconError}
            <p>${escapeHtml(message)}</p>
        </div>
    `;
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}
