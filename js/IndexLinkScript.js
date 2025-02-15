// Path to the JSON file
var jsonFilePath = "YearlyCSV/StyleAndLinks.json";

// Function to fetch the JSON and update the embed links
function LoadEmbedLinks() {
    fetch(jsonFilePath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Set the src for the embed elements from the JSON data
            document.getElementById("blueAllianceEmbed").src = data.IndexEventLinkBlueAllinace;
            document.getElementById("statBoticsEmbed").src = data.IndexEventLinkStatBotics;
        })
        .catch((error) => {
            console.error("Error fetching JSON:", error);
        });
}
LoadEmbedLinks();
