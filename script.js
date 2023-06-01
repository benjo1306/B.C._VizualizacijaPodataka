var width = window.innerWidth - 40;
var height = window.innerHeight - 40;

var scaleWidth = 400;
var scaleHeight = 30;

var svg = d3.select("#content").append("svg").attr("width", width).attr("height", height)

var projection = d3.geoMercator().center([0, 40]).scale(220).translate([width / 2, height / 2]);

var path = d3.geoPath(projection);

var g = svg.append("g");

var zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

svg.call(zoom);

function zoomed(event) {
    g.attr("transform", event.transform);
}

var tooltip = d3.select("#content").append("div")
    .attr("class", "tooltip");

var scaleColor = d3.scaleLinear()
    .domain([0, 300000])
    .range(["white", "blue"]);

var hivDeaths = svg.append("g")
    .attr("width", scaleWidth)
    .attr("height", scaleHeight)
    .attr("transform", `translate(${width / 1.5 - height / 2}, ${height - 100})`);

var barWidth = scaleWidth / 10;

hivDeaths.selectAll(".scale")
    .data(d3.range(10))
    .enter()
    .append("rect")
    .attr("x", function (d, i) { return i * barWidth; })
    .attr("y", 0)
    .attr("width", barWidth)
    .attr("height", scaleHeight)
    .attr("fill", function (d) { return scaleColor(d * 50000); });

const legendScale = d3.scaleLinear()
    .domain([0, 300000])
    .range([0, scaleWidth]);

const legendAxis = d3.axisBottom(legendScale)
    .ticks(5)
    .tickSize(10)
    .tickFormat((d) => {
        if (d === 300000) {
            return "300k<";
        } else {
            return d3.format("0.0s")(d);
        }
    });

var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${width / 1.5 - height / 2}, ${height - 70})`);



legend.call(legendAxis);

var xAxisLabel = svg.append("text")
    .attr("x", width / 1.1 - height / 2)
    .attr("y", height - 70)
    .style("text-anchor", "middle")
    .style("fill", "red") 
    .text("HIV DEATH RATE");



function updateBarChart(Country, hivData, hivDataLiving) {
    const filteredDataDeaths = hivData.filter(item => item.Country === Country && item.Count_median !== "");
    const yearsDeath = filteredDataDeaths.map(item => item.Year);
    const deathHivCounts = filteredDataDeaths.map(item => parseInt(item.Count_median));
    const totalDeaths = d3.sum(deathHivCounts);

    const filteredDataLiving = hivDataLiving.filter(item => item.Country === Country && item.Count_median !== "");
    const yearsLiving = filteredDataLiving.map(item => item.Year);
    const livingHivCounts = filteredDataLiving.map(item => parseInt(item.Count_median));
    const averageLivingHivCount = livingHivCounts.length > 0 ? d3.mean(livingHivCounts) : "No data";

    const barChartHeight = 500;
    const barChartWidth = 500;


    const margin = { top: 20, right: 80, bottom: 30, left: 150 };


    const width = barChartWidth - margin.left - margin.right;
    const height = barChartHeight - margin.top - margin.bottom;


    const xScale = d3.scaleBand()
        .domain(yearsDeath)
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(deathHivCounts)])
        .range([height, 0]);


    const barChart = d3.select("#barchart")
        .html("")
        .append("svg")
        .attr("width", barChartWidth)
        .attr("height", barChartHeight)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    

    barChart.selectAll(".bar")
        .data(filteredDataDeaths)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.Year))
        .attr("y", d => yScale(parseInt(d.Count_median)))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(parseInt(d.Count_median)))
        .style("fill", "darkblue");


    barChart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));


    barChart.append("g")
        .call(d3.axisLeft(yScale));

    
const barChart2 = d3.select("#barchart2")
    .html("")
    .append("svg")
    .attr("width", barChartWidth)
    .attr("height", barChartHeight)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const xScale2 = d3.scaleBand()
    .domain(yearsLiving)
    .range([0, width])
    .padding(0.1);

const yScale2 = d3.scaleLinear()
    .domain([0, d3.max(livingHivCounts) * 1.1])
    .range([height, 0]);

barChart2.selectAll(".bar")
    .data(filteredDataLiving)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale2(d.Year))
    .attr("y", d => yScale2(parseInt(d.Count_median)))
    .attr("width", xScale2.bandwidth())
    .attr("height", d => height - yScale2(parseInt(d.Count_median)))
    .style("fill", "lightblue");

barChart2.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale2));

barChart2.append("g")
    .call(d3.axisLeft(yScale2));

barChart2.append("text")
    .attr("class", "x-axis-label")
    .attr("x", width - 30)
    .attr("y", 480)
    .style("text-anchor", "middle")
    .text("Year");

barChart2.append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -50)
    .attr("y", 0 - margin.left + 50)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("People living with HIV");

    barChart.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width - 30)
        .attr("y", 480)
        .style("text-anchor", "middle")
        .text("Year");

    barChart.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -50)
        .attr("y", 0 - margin.left + 50)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Hiv death count");

    if (totalDeaths === 0) {
        barChart.html("")

    }

}


Promise.all([
    fetch('newWorldTopo.json').then(response => response.json()),
    fetch('number_of_deaths_from_hiv.json').then(response => response.json()),
    fetch('number_of_people_living_with_HIV.json').then(response => response.json())
    
]).then(([topoData, hivDataDeaths, hivDataLiving]) => {

    var countries = topojson.feature(topoData, topoData.objects.newWorld);

    const filteredDataDeaths = hivDataDeaths.filter(data => data.Count_median !== "");

    const filteredDataLiving = hivDataLiving.filter(data => data.Count_median !== "");
    const livingHivCounts = filteredDataLiving.map(data => parseInt(data.Count_median));



    const countryDeaths = {};
    filteredDataDeaths.forEach(data => {
        const country = data.Country;
        const deaths = data.Count_median;
        if (countryDeaths[country]) {
            countryDeaths[country] += deaths;
        } else {
            countryDeaths[country] = deaths;
        }
    });

    g.selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path)
        .on("mouseover", function (event, d) {
            const Country = d.properties.name;
            const deathCount = countryDeaths[Country] || "No data";
            const filteredDataLiving = hivDataLiving.filter(item => item.Country === Country && item.Count_median !== "");
            const livingHivCounts = filteredDataLiving.map(item => parseInt(item.Count_median));
            const averageLivingHivCount = livingHivCounts.length > 0 ? d3.mean(livingHivCounts) : "No data";
            const tooltipContent = `Country: ${Country}<br>Total deaths: ${deathCount}<br>Avg infection: ${averageLivingHivCount !== "No data" ? d3.format(".2s")(averageLivingHivCount) : averageLivingHivCount}`;        
            tooltip
                .html(tooltipContent)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 10}px`)
                .style("opacity", 0.9);
        })
        .style("fill", function (d) {
            const Country = d.properties.name;
            const deathCount = countryDeaths[Country] || 0;
            return countryDeaths[Country] ? scaleColor(deathCount) : "lightgray";
        })

        .on("click", function (event, d) {
            const Country = d.properties.name;
            updateBarChart(Country, hivDataDeaths, hivDataLiving);
            // updatePieChart(Country, hivDataDeaths);
        })
});