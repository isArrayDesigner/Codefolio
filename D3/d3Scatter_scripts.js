function responsivefy(svg) {
  let container = d3.select(svg.node().parentNode)

  let width = parseInt(svg.style('width'), 10)

  let height = parseInt(svg.style('height'), 10)

  let aspect = width / height

  svg
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('preserveAspectRatio', 'xMinYMid')
    .call(resize)

  d3.select(window).on('resize.' + container.attr('id'), resize)

  function resize() {
    let w = parseInt(container.style('width'))
    svg.attr('width', w)
    svg.attr('height', Math.round(w / aspect))
  }
}

String.prototype.commafy = function () {
  return this.replace(/(^|[^\w.])(\d{4,})/g, function ($0, $1, $2) {
    return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
  });
};

// set the dimensions and margins of the graph
let margin = {
    top: 10,
    right: 100,
    bottom: 30,
    left: 30
  },
  width = 960 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_connectedscatter.csv", function (data) {

  // List of groups (here I have one group per column)
  let allGroup = ["valueA", "valueB", "valueC"]

  // add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) {
      return d;
    }) // text showed in the menu
    .attr("value", function (d) {
      return d;
    }) // corresponding value returned by the button

  // Add X axis --> it is a date format
  let x = d3.scaleLinear()
    .domain([0, 10])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  let y = d3.scaleLinear()
    .domain([0, 20])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Initialize line with group a
  let line = svg
    .append('g')
    .append("path")
    .datum(data)
    .attr("d", d3.line()
      .x(function (d) {
        return x(+d.time)
      })
      .y(function (d) {
        return y(+d.valueA)
      })
    )
    .attr("stroke", "#FFB74D")
    .style("stroke-width", 4)
    .style("fill", "none")

  // Initialize dots with group a
  let dot = svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr("cx", function (d) {
      return x(+d.time)
    })
    .attr("cy", function (d) {
      return y(+d.valueA)
    })
    .attr("r", 7)
    .style("fill", "#FF9802")

  // A function that update the chart
  function update(selectedGroup) {

    // Create new data with the selection?
    let dataFilter = data.map(function (d) {
      return {
        time: d.time,
        value: d[selectedGroup]
      }
    })

    // Give these new data to update line
    line
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function (d) {
          return x(+d.time)
        })
        .y(function (d) {
          return y(+d.value)
        })
      )
    dot
      .data(dataFilter)
      .transition()
      .duration(1000)
      .attr("cx", function (d) {
        return x(+d.time)
      })
      .attr("cy", function (d) {
        return y(+d.value)
      })
  }

  // When the button is changed, run the updateChart function
  d3.select("#selectButton").on("change", function (d) {
    // recover the option that has been chosen
    let selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    update(selectedOption)
  })

})

$('#svgContainer')
  .detach()
  .appendTo('#fullPageContent')
$('#quickLinks').addClass('d-none')
$('#videoPlayer').hide()
$('#fullPageContent > div:nth-child(1)').hide()