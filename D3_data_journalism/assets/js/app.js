//Setting up SVG size and Margins
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

// Creating SVG wrapper, appending SVG group that will hold the chart, and shifting by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Chart selection variables to toggle data elements and defaulting them to Poverty and Healthcare
var selectedXAxis = 'poverty'
var selectedYAxis = 'healthcare'

// Importing data and processing
d3.csv("assets/data/data.csv").then(function(healthData) {
  console.log(healthData);
  //Parsing and casting data as numbers
  healthData.forEach(function(data) {
    data.id = +data.id;
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    data.income = +data.income;
  });

  //Creating scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[selectedXAxis])*0.9, d3.max(healthData, d => d[selectedXAxis])*1.1])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[selectedYAxis]), d3.max(healthData, d => d[selectedYAxis])+1])
    .range([height, 0]);

  //Creating axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  //Appending axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  //Creating Circles Group
  var circlesGroup = svg.selectAll('g circle')
    .data(healthData)
    .enter()
    .append('g')
    .attr("transform", d => `translate(${xLinearScale(d[selectedXAxis])+100}, ${yLinearScale(d[selectedYAxis])+5})`);

  //Creating Circles
  var circles = circlesGroup
    .append("circle")
    .attr("r", "15")
    .classed("stateCircle", true);
  
  //Adding Text to Circle
  var texts = circlesGroup
    .append("text")
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

  // Creating X axes labels
  const xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height})`);

  const povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty")
    .text("In Poverty (%)")
    .classed("active", true);

  const ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age")
    .text("Age (Median)")
    .classed("inactive", true);

  const incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("value", "income")
    .text("Household Income (Median)")
    .classed("inactive", true);

  // Create Y axis labels
  const ylabelsGroup = chartGroup.append("g");

  const healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -40)
    .attr("value", "healthcare") // value to grab for event listener
    .text("Lacks Healthcare (%)")
    .classed("active", true);

  const smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("value", "smokes") // value to grab for event listener
    .text("Smokes (%)")
    .classed("inactive", true);

  const obeseLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -80)
    .attr("value", "obesity") // value to grab for event listener
    .text("Obese (%)")
    .classed("inactive", true);

  }).catch(function(error) {
    console.log(error);
  });
