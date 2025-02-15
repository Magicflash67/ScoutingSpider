// Path to the JSON file relative to the server's working directory
const JsonFilePath = 'YearlyCSV/Points.json';

// Initialize the Points object
let Points = {};

// Fetch and parse the JSON file to dynamically update the Points object
fetch(JsonFilePath)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        Points = data; // Update Points dynamically with the JSON file contents
        console.log('Points:', Points);
        fetchCSV(); // Proceed to fetch and process the CSV
    })
    .catch(error => console.error('Error loading JSON:', error));

// Function to fetch and parse the CSV file
async function fetchCSV() {
    const response = await fetch('YearlyCSV/Summary.csv'); // Update path as needed
    const data = await response.text();
    Papa.parse(data, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            buildTables(results.data); // Pass parsed CSV data to the table builder
        }
    });
}

// Function to calculate the position score for a team
function calcPosition(row) {
    let total = 0;
    for (const key in Points) {
        if (Points[key] !== null && row[key] !== null && row[key] !== undefined) {
            total += Points[key] * row[key]; // Calculate based on point value and team data
        }
    }
    return total;
}

// Function to build the leaderboard tables
// Function to build the leaderboard tables
function buildTables(dataset) {
    // Calculate positions and sort the dataset
    dataset.forEach(teamData => {
        teamData.positionsTotal = calcPosition(teamData);
    });
    dataset.sort((a, b) => b.positionsTotal - a.positionsTotal);
    const totalTeams = dataset.length;
    let TableSet = `
        <table id="mainTable" style="margin: auto !important;">
            <tr>
                <th>Rank</th>
                <th>Team Number</th>
                <th>Team Name</th>
                <th>Points</th>
            </tr>
    `;

    dataset.forEach((teamData, index) => {
        const rank = index + 1; // Rank is now based on the sorted order

        // Add team data to the main table
        TableSet += `
            <tr onclick="toggleTables(${index})">
                <td>${rank}</td>
                <td>${teamData["Team Number"]}</td>
                <td>${teamData["Team Names"]}</td>
                <td>${teamData.positionsTotal}</td>
            </tr>
        `;

        // Create a sub-table for point details
        let pointsTable = `
            <table class="secondTable">
                <tr>
                    <th>Position</th>
                    <th>Count</th>
                    <th>Point Value</th>
                </tr>
        `;
        for (const key in Points) {
            const count = teamData[key] || 0; // Use 0 if value is null or undefined
            const pointValue = Points[key] !== null ? (count * Points[key]) : 'N/A';
            pointsTable += `
                <tr>
                    <td>${key}</td>
                    <td>${count}</td>
                    <td>${pointValue}</td>
                </tr>
            `;
        }
        pointsTable += '</table>';

        // Add the sub-table to the main table
        TableSet += `<tr><td colspan="4">${pointsTable}</td></tr>`;
    });

    TableSet += '</table>';
    document.getElementById("tableContainer").innerHTML = TableSet;
}

// Function to toggle the display of sub-tables
function toggleTables(index) {
    const secondTable = document.querySelectorAll('.secondTable')[index];
    if (secondTable) {
        secondTable.style.display = secondTable.style.display === 'none' ? 'table' : 'none';
    }
}