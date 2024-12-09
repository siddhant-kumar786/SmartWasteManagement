// Fetch the data from ThingSpeak API
async function fetchData() {
    const channelId = '2749381';  // Replace with your Channel ID
    const apiKey = 'Q0NLO8HGDJRJGYIQ';  // Replace with your API Key
    const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.feeds && data.feeds.length > 0) {
            const latestFeed = data.feeds[0];
            updatePageData(latestFeed);  // Update data on the page
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('dry-status').innerHTML = 'Failed to fetch data for Dry Bin.';
        document.getElementById('wet-status').innerHTML = 'Failed to fetch data for Wet Bin.';
        document.getElementById('moisture-status').innerHTML = 'Failed to fetch Moisture data.';
    }
}

// Update the page with the fetched data
function updatePageData(feed) {
    const field1 = parseFloat(feed.field1);  // Dry Bin Distance (in cm)
    const field2 = parseFloat(feed.field2);  // Wet Bin Distance (in cm)
    const moisture = parseFloat(feed.field3); // Soil Moisture

    if (!isNaN(field1) && !isNaN(field2) && !isNaN(moisture)) {
        const dryBinRemainingSpace = calculateRemainingSpace(field1);
        const wetBinRemainingSpace = calculateRemainingSpace(field2);

        const dryBinPercentageLeft = calculatePercentageLeft(dryBinRemainingSpace);
        const wetBinPercentageLeft = calculatePercentageLeft(wetBinRemainingSpace);

        const dryBinStatus = `Dry Bin: ${dryBinRemainingSpace} cm (${dryBinPercentageLeft}% left)`;
        const wetBinStatus = `Wet Bin: ${wetBinRemainingSpace} cm (${wetBinPercentageLeft}% left)`;
        const moistureStatus = `Soil Moisture: ${moisture}%`;

        // Display data
        document.getElementById('dry-status').innerHTML = dryBinStatus;
        document.getElementById('wet-status').innerHTML = wetBinStatus;
        document.getElementById('moisture-status').innerHTML = moistureStatus;
    } else {
        document.getElementById('dry-status').innerHTML = 'Invalid data for Dry Bin.';
        document.getElementById('wet-status').innerHTML = 'Invalid data for Wet Bin.';
        document.getElementById('moisture-status').innerHTML = 'Invalid data for Moisture.';
    }
}

// Remaining space calculation for the bins
function calculateRemainingSpace(distance) {
    return distance;
}

// Percentage remaining space
function calculatePercentageLeft(remainingSpace) {
    const totalSpace = 400;
    return ((remainingSpace / totalSpace) * 100).toFixed(2);
}


function showHome() {
    console.log("showHome function called");
    const homeContent = document.getElementById('home-content');
    homeContent.style.display = 'flex'; // Use flex for proper layout
    homeContent.style.flexDirection = 'row'; // Ensure children are vertical
    document.getElementById('status-content').style.display = 'none';
    document.getElementById('graphs-content').style.display = 'none';
}


// Status button functionality
function showStatus() {
    document.getElementById('home-content').style.display = 'none';
    document.getElementById('status-content').style.display = 'block';
    document.getElementById('graphs-content').style.display = 'none';

    fetchData(); // Fetch data when status is clicked
}

// Graphs button functionality
function showGraphs() {
    document.getElementById('home-content').style.display = 'none';
    document.getElementById('status-content').style.display = 'none';
    document.getElementById('graphs-content').style.display = 'block';
}

// Initial setup to show Home content
window.onload = showHome;
