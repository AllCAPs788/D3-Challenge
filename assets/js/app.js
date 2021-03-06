

//scatter dimensions
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

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcareLow"

  // Add X axis ("In Poverty (%)")

function xScale(state_Data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(state_Data, d => d[chosenXAxis]) * 0.8,
      d3.max(state_Data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

function renderXaxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function yScale(state_Data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(state_Data, d => d[chosenYAxis]) * 0.8,
      d3.max(state_Data, d => d[chosenYAxis]) * 1.2
    ])
    .range([0, width]);

  return yLinearScale;

}

function renderYaxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

//import csv

d3.csv("assets/data/state_income_csv.csv").then(function(state_Data, err) {
  if (err) throw err;

  // parse data
  state_Data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcareLow = +data.healthcareLow;
    //data.num_albums = +data.num_albums;
  });
  // Print the tvData
  // console.log(state_Data);


  
  
  //   chartGroup.append("g")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(d3.axisLeft(xLinearScale));

  // // Add Y axis
  // var y = d3.scaleLinear()
  //   .domain([0, d3.max(state_Data, d => d.healthcareLow)])
  //   .range([ height, 0]);
  // svg.append("g")
  //   .call(d3.axisLeft(y));

    
  //     hairData.forEach(function(data) {
  //       data.poverty = +data.poverty;
  //       data.healthcareLow = +data.healthcareLow;
  //     // console.log(poverty)
  //     });
    
      // xLinearScale function above csv import
      var xLinearScale = xScale(state_Data, chosenXAxis);
    
      // Create y scale function
      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(state_Data, d => d.healthcareLow)])
        .range([height, 0]);
    
      // Create initial axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
    
      // append x axis
      var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
      // append y axis
      chartGroup.append("g")
        .call(leftAxis);
    
      // append initial circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(state_Data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcareLow))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5");
    
      // Create group for two x-axis labels
      var labelsGroup = chartGroup.append("g");
        //.attr("transform", `translate(${width / 2}, ${height + 20})`);
    
      var labelsGroupY = chartGroup.append("g");
        //.attr("transform", `translate(${width / 2}, ${height + 20})`);
      var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");
    
      var yLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "healthcareLow") // value to grab for event listener
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");
    
      // append y axis
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)");
    
      // updateToolTip function above csv import
      var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.healthcareLow}<br>${label} ${d[chosenXAxis]}`);
    });
    
    
    labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(hairData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "num_albums") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          yLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          albumsLabel
            .classed("active", false)
            .classed("inactive", true);
          hairLengthLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

    labelsGroupY.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(hairData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "num_albums") {
          albumsLabel
            .classed("active", true)
            .classed("inactive", false);
          hairLengthLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          albumsLabel
            .classed("active", false)
            .classed("inactive", true);
          hairLengthLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
    
    
      }).catch(function(error) {
        console.log(error);
           
  });
    
    
    



      //exercise 12, day 3 code organization (functions and readability)