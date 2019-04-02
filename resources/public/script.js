$(document).ready(function(){

  $('#generate').trigger('click')

})

$("#generate").click(function() {
  let lambda = $("#lambda").val();
  let generations = $("#generations").val();
  $.get("/populations/" + lambda + "/" + generations, function(data) {
    graphPopulation(data)
  })
})

function graphPopulation(data) {
  var data = parseResponse(data)
  var x = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, 420]);

  d3.select(".chart")
    .selectAll("div")
      .data(data)
    .enter().append("div")
      .style("width", function(d) { return x(d) + "px"; })
      .text(function(d) { return d; });
}

function parseResponse(data) {
  return data.slice(1,-1).split(" ")
}
