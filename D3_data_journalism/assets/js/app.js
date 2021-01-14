var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {
  console.log(healthData);
  // Step 1: Parse Data/Cast as numbers
  // ==============================
  healthData.forEach(function(data) {
    data.id = +data.id;
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d.poverty)*0.9, d3.max(healthData, d => d.poverty)*1.1])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d.healthcare), d3.max(healthData, d => d.healthcare)+1])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Step 5: Create Circles
  // ==============================
  var circlesGroup = svg.selectAll('g')
    .data(healthData)
    .enter()
    .append('g')
    .attr("transform", d => `translate(${xLinearScale(d.poverty)+100}, ${yLinearScale(d.healthcare)+5})`);
  //.classed('bubble', true)
  //.on('mouseover', showDetail)
  //.on('mouseout', hideDetail)

  //var circles = chartGroup.selectAll("circle")
  var circles = circlesGroup
    //.data(healthData)
    //.enter()
    .append("circle")
    //.attr("cx", d => xLinearScale(d.poverty))
    //.attr("cy", d => yLinearScale(d.healthcare)-15)
    .attr("r", "15")
    //.attr("fill", "pink")
    //.attr("opacity", ".5");
    .classed("stateCircle", true);
  
  // Adding Text to Circle
  //var texts = chartGroup.selectAll("text")
  var texts = circlesGroup
    //.data(healthData)
    //.enter()
    .append("text")
    //.attr("dx", d => xLinearScale(d.poverty))
    //.attr("dx", -7)
    //.attr("dy", d => yLinearScale(d.healthcare)-10)
    .attr("dy", 5)
    .text(d => d.abbr)
    .classed("stateText", true);

    // Step 6: Initialize tool tip
    // ==============================
    /* var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.rockband}<br>Hair length: ${d.health_length}<br>Hits: ${d.num_hits}`);
      }); */

    // Step 7: Create tooltip in the chart
    // ==============================
    //chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    /* circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      }); */

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });
