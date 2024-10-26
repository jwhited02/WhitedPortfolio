// Fetch the GeoJSON data from the specified endpoint
fetch(`/data?month=all`)
    .then(response => response.json())  // Convert the response to JSON format
    .then(geojson => {
        const rows = geojson.features.map(feature => ({
            month: feature.properties.month,
            day: feature.properties.day,
            date: feature.properties.date
        }));

        // Initialize objects to store tornado counts by day for each month, total tornado counts per month, and counts by day of the year
        const dailyCountsByMonth = {};
        const monthlyCounts = {};
        const tornadoCountsByDate = {};

        // Iterate through each row of the data
        rows.forEach(row => {
            const month = row.month.toString().padStart(2, '0');  // Extract the month
            const day = row.day.toString().padStart(2, '0');    // Extract the day
            const dateKey = row.date;  // Use the provided date key (e.g., "2023-01-01")

            // Initialize or update the count for the specific day in the specific month
            if (!dailyCountsByMonth[month]) {
                dailyCountsByMonth[month] = {};
                monthlyCounts[month] = 0;  // Initialize the monthly count
            }

            if (dailyCountsByMonth[month][day]) {
                dailyCountsByMonth[month][day] += 1;
            } else {
                dailyCountsByMonth[month][day] = 1;
            }

            // Increment the monthly count for the current month
            monthlyCounts[month] += 1;

            // Increment the count for the specific date
            if (tornadoCountsByDate[dateKey]) {
                tornadoCountsByDate[dateKey] += 1;
            } else {
                tornadoCountsByDate[dateKey] = 1;
            }
        });

        // Populate the dropdown with the available months, "All Months", and "All Days of the Year" options
        const monthSelect = document.getElementById('monthSelect');
        const months = Object.keys(dailyCountsByMonth);

        const allMonthsOption = document.createElement('option');
        allMonthsOption.value = 'all';
        allMonthsOption.textContent = 'All Months';
        monthSelect.appendChild(allMonthsOption);

        const allDaysOption = document.createElement('option');
        allDaysOption.value = 'all_days';
        allDaysOption.textContent = 'All Days of the Year';
        monthSelect.appendChild(allDaysOption);

        months.forEach(month => {
            const date = new Date(2023, month - 1);
            const monthName = date.toLocaleString('default', { month: 'long' });

            const option = document.createElement('option');
            option.value = month;
            option.textContent = monthName;
            monthSelect.appendChild(option);
        });

        // Function to update the chart based on the selected option
        function updateChart(selectedOption) {
            let xData, yData, title, xAxisTitle;

            if (selectedOption === 'all') {
                // Plotting for "All Months"
                xData = months.map(month => new Date(2023, month - 1).toLocaleString('default', { month: 'long' }));  // Month names for x-axis
                yData = months.map(month => monthlyCounts[month]);  // Total tornado counts per month

                title = 'Monthly Tornado Counts for All Months in 2023';
                xAxisTitle = 'Month';
            } else if (selectedOption === 'all_days') {
                // Plotting for "All Days of the Year"
                const startDate = new Date('2023-01-01');
                const endDate = new Date('2023-12-31');
                xData = [];
                yData = [];

                for (let dt = startDate; dt <= endDate; dt.setDate(dt.getDate() + 1)) {
                    const dateString = dt.toISOString().split('T')[0];  // Format as "YYYY-MM-DD"
                    xData.push(dateString);
                    yData.push(tornadoCountsByDate[dateString] || 0);  // Use 0 if no tornadoes on that date
                }

                title = 'Daily Tornado Counts for the Year 2023';
                xAxisTitle = 'Date';
            } else {
                // Plotting for a specific month
                const daysInMonth = new Date(2023, selectedOption, 0).getDate();  // Get the total number of days in the selected month
                xData = Array.from({ length: daysInMonth }, (_, i) => i + 1);  // Create an array [1, 2, ..., 31]

                // Ensure that each day of the month has a corresponding tornado count, defaulting to 0 if no data exists
                yData = xData.map(day => {
                    const dayString = day.toString().padStart(2, '0');  // Convert day to a two-digit string
                    return dailyCountsByMonth[selectedOption][dayString] || 0;   // Return the count for that day or 0 if no tornadoes
                });

                title = `Daily Tornado Counts in ${new Date(2023, selectedOption - 1).toLocaleString('default', { month: 'long' })} 2023`;
                xAxisTitle = 'Day of the Month';
            }

            const data = [{
                x: xData,  // x-axis data: months, days, or dates
                y: yData,  // y-axis data: tornado counts for each month, day, or date
                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'blue' },
                line: { shape: 'linear' }
            }];

            const layout = {
                title: title,
                xaxis: { 
                    title: xAxisTitle,
                    tickmode: 'linear',
                    dtick: selectedOption === 'all' ? 1 : null,  // Ensure each month is represented for "All Months"
                    tickformat: selectedOption === 'all_days' ? '%b %d' : null,  // Format dates as "Jan 01" for "All Days"
                    dtick: selectedOption === 'all_days' ? 86400000 * 30 : null  // Tick every 30 days for "All Days"
                },
                yaxis: { title: 'Number of Tornadoes', rangemode: 'tozero' }
            };

            Plotly.newPlot('tornadoChart', data, layout);
        }

        // Event listener for the dropdown to update the chart when a different option is selected
        monthSelect.addEventListener('change', (event) => {
            updateChart(event.target.value);
        });

        // Automatically generate the chart for "All Months" when the page loads
        monthSelect.value = 'all';
        updateChart('all');
    })
    .catch(error => console.error('Error loading the data:', error));
