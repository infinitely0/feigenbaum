$(document).ready(function(){

  $('#generate').trigger('click')

})

$("#generate").click(function() {
  let lambda = $("#lambda").val();
  let generations = $("#generations").val();
  $.get("/populations/" + lambda + "/" + generations, function(res) {
    let data = parseResponse(res)
    graphPopulations(data)
  })
})

function parseResponse(res) {
  data = res.slice(1,-1).split(" ")
  data.forEach(function(val, i) {
    data[i] = { generation: i, population: val }
  })
  return data
}

function graphPopulations(data) {
  let margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  }

  let width = 960 - margin.left - margin.right
  let height = 500 - margin.top - margin.bottom

  let x = d3.scaleBand().range([0, width])
  let y = d3.scaleLinear().range([height, 0])

  x.domain(data.map(function(d) { return d.generation }))
  y.domain([0, d3.max(data, function(d) { return d.population })])

  let line = d3.line()
    .x(function(d) { return x(d.generation); })
    .y(function(d) { return y(d.population); })

  let svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", line);

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  svg.append("g")
      .call(d3.axisLeft(y));
}

