//Setting up SVG size and Margins
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
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

  //Creating X & Y Scale
  var xLinearScale = createXScale(healthData,selectedXAxis);
  var yLinearScale = createYScale(healthData,selectedYAxis);

  //Creating axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  //Appending axes to the chart
  var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

  var yAxis = chartGroup.append("g")
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
    .attr("value", "healthcare")
    .text("Lacks Healthcare (%)")
    .classed("active", true);

  const smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("value", "smokes")
    .text("Smokes (%)")
    .classed("inactive", true);

  const obeseLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -80)
    .attr("value", "obesity")
    .text("Obese (%)")
    .classed("inactive", true);
  
  //Click event listner for X axis
  xlabelsGroup.selectAll("text")
    .on("click", function() {
    //Getting the value of selection
    const value = d3.select(this).attr("value");
    //Checking user clicked option with our axis variable
    if (value !== selectedXAxis) {
      selectedXAxis = value;
      //updating chart parameters based on user selection
      updateChart(healthData,selectedXAxis,selectedYAxis,circlesGroup,xAxis,yAxis);
      
      //Changing XAxis Label class to toggle display
      if (selectedXAxis === "age") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (selectedXAxis === "income") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
      }
      else {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
    }
  });

  //Click event listner for Y axis
  ylabelsGroup.selectAll("text")
    .on("click", function() {
    //Getting the value of selection
    const value = d3.select(this).attr("value");
    //Checking user clicked option with our axis variable
    if (value !== selectedYAxis) {
      selectedYAxis = value;
      //updating chart parameters based on user selection
      updateChart(healthData,selectedXAxis,selectedYAxis,circlesGroup);
      
      //Changing XAxis Label class to toggle display
      if (selectedYAxis === "smokes") {
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (selectedYAxis === "obesity"){
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
          .classed("active", true)
          .classed("inactive", false);
      }
      else {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
      }
    }
  });

}).catch(function(error) {
  console.log(error);
});

//Function to update the Chart based on user selection
function updateChart(csvData, selectedXAxis, selectedYAxis, circlesGroup, xAxis, yAxis) {
  //Updateding Chart scale
  var xLinearScale = createXScale(csvData,selectedXAxis);
  var yLinearScale = createYScale(csvData,selectedYAxis);
  //Setting axis
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  //Updating Axis values
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  //Updating Circle Values
  circlesGroup.transition()
    .duration(1000)
    .attr("transform", d => `translate(${xLinearScale(d[selectedXAxis])+100}, ${yLinearScale(d[selectedYAxis])+5})`);
}

//Updating X axis upon click on axis label
function createXScale(csvData, selectedXAxis) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(csvData, d => d[selectedXAxis])*0.9, d3.max(csvData, d => d[selectedXAxis])*1.1])
    .range([0, width]);

  return xLinearScale;
}

//Updating X axis upon click on axis label
function createYScale(csvData, selectedYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(csvData, d => d[selectedYAxis]), d3.max(csvData, d => d[selectedYAxis])+1])
    .range([height, 0]);

  return yLinearScale;
}