document.addEventListener("DOMContentLoaded", () => loadData());

async function loadData() {
    try {
        const response = await fetch('YearlyCSV/RawData.csv');
        if (!response.ok) throw new Error(`Failed to fetch CSV file: ${response.statusText}`);

        const csvText = await response.text();
        const csvData = parseCSV(csvText);
        if (!csvData.length) throw new Error("CSV file is empty or invalid");

        const { matchesDict, matchDataDict, teamsDict } = processCSVData(csvData);
        const sortedTeams = Object.keys(teamsDict).sort((a, b) => parseInt(a) - parseInt(b));

        generateHTML(sortedTeams, matchesDict, matchDataDict, teamsDict, Object.keys(csvData[0]));
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

function parseCSV(csvText) {
    return Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
    }).data;
}

function processCSVData(csvData) {
    const matchesDict = {}, matchDataDict = {}, teamsDict = {};

    csvData.forEach(row => {
        const matchNumber = row['Match Number'];
        const teamNumber = row['Team Number'];

        if (!matchNumber || !teamNumber) return; // Skip invalid rows

        matchesDict[matchNumber] ??= [];
        matchDataDict[matchNumber] ??= [];
        teamsDict[teamNumber] ??= [];

        matchesDict[matchNumber].push(teamNumber);
        matchDataDict[matchNumber].push(row);

        if (!teamsDict[teamNumber].includes(matchNumber)) {
            teamsDict[teamNumber].push(matchNumber);
        }
    });

    return { matchesDict, matchDataDict, teamsDict };
}

function generateHTML(sortedTeams, matchesDict, matchDataDict, teamsDict, headers) {
    const mainTable = document.getElementById('main-table');
    mainTable.innerHTML += sortedTeams.map(teamNumber => `
        <tr>
            <td>${teamNumber}</td>
            <td>${teamsDict[teamNumber].join(', ')}</td>
            <td><button class="show-btn" data-team="${teamNumber}">Show</button></td>
        </tr>
    `).join('');

    document.addEventListener('click', event => {
        if (event.target.classList.contains('show-btn')) {
            showTeamMatches(event.target.dataset.team, teamsDict, matchDataDict, headers);
        }
    });
}

function showTeamMatches(teamNumber, teamsDict, matchDataDict, headers) {
    const teamMatches = teamsDict[teamNumber] || [];
    if (!teamMatches.length) {
        alert(`No matches found for team ${teamNumber}`);
        return;
    }

    const teamMatchesData = teamMatches.flatMap(matchNumber =>
        matchDataDict[matchNumber].filter(row => row['Team Number'] === teamNumber)
    );

    const detailsTable = document.getElementById('match-details-table');
    detailsTable.innerHTML = `
        <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
        ${teamMatchesData.map(row => `
            <tr>${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}</tr>
        `).join('')}
    `;

    document.getElementById('2nd-table').style.display = 'block';
    document.getElementById('2nd-table').scrollIntoView({ behavior: 'smooth' });
}

function clearTable() {
    document.getElementById('2nd-table').style.display = 'none';
    document.getElementById('match-details-table').innerHTML = '';
}
