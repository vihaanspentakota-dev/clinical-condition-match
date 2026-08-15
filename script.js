const input = document.getElementById("symptomInput");
const button = document.getElementById("checkButton");
const resultsList = document.getElementById("resultsList");

button.addEventListener("click", async function () {

    const symptoms = input.value.trim();

    if (symptoms === "") {
        resultsList.innerHTML = "<p>Please enter some symptoms.</p>";
        return;
    }

    resultsList.innerHTML = "<p>Checking...</p>";

    try {
        const response = await fetch(
            "http://127.0.0.1:5000/check?symptoms=" +
            encodeURIComponent(symptoms)
        );

        const results = await response.json();

        resultsList.innerHTML = "";

        if (results.length === 0) {
            resultsList.innerHTML = "<p>No matching conditions found.</p>";
            return;
        }

        results.forEach(function (result) {

            const div = document.createElement("div");

            div.textContent =
                result.condition +
                " - " +
                result.matches +
                " matching symptom(s)";

            resultsList.appendChild(div);
        });

    } catch (error) {
        resultsList.innerHTML =
            "<p>Could not connect to the Python API.</p>";
    }
});