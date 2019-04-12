$(document).ready(function(){

  $('#drawBifurcations').trigger('click')

})

data = []

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

y.domain([0, 1])

let line = d3.line()

let svg = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", line)

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

svg.append("g")
    .call(d3.axisLeft(y))

function fetchPopulations(lambda, gens, callback) {
  $.get("/populations/" + lambda + "/" + gens, function(res) {
    let data = parsePopulations(res)
    callback(data)
  })
}

function fetchBifurcations(lambda, gens, step, callback) {
  $.get("/bifurcations/" + lambda + "/" + gens + "/" + step, function(res) {
    let data = parseBifurcations(res)
    callback(data)
  })
}

function drawPopulations(lambda, generations) {
  fetchPopulations(lambda, generations, function(data) {

    let stablePops = findStablePops(data)
    $("#periodicity").text(stablePops.size)
    $("#stablePops").html(Array.from(stablePops).join("<br>"))

    data.forEach(function(val, i) {
      data[i] = { generation: i, population: val }
    })

    x.domain(data.map(function(d) { return d.generation }))

    let line = d3.line()
      .x(function(d) { return x(d.generation) })
      .y(function(d) { return y(d.population) })

    let svg = d3.select(".chart").transition()

    svg.select(".line")
        .duration(750)
        .attr("d", line(data))
  })
}

function drawBifurcations(lambda, gens, step) {
  fetchBifurcations(lambda, gens, step, function(data) {
    console.log(data)
  })
}

function findStablePops(populations) {
  return new Set(populations.slice(-100, -1))
}

function parsePopulations(res) {
  return res.slice(1,-1).split(" ")
}

function parseBifurcations(res) {
  return JSON.parse(res)
}

$("#drawPopulations").click(function() {
  let lambda = $("#lambda").val()
  let generations = $("#generations").val()

  drawPopulations(lambda, generations)
})

$('input[type=range]').change(function(){
  let lambda = $(this).val()
  $("#lambda_value").text(lambda)

  drawPopulations(lambda, 200)
})

$("#drawBifurcations").click(function() {
  drawBifurcations(0, 100, 0.1)
})

$("#viewBifurcations").click(function() {
  $("#page1").hide()
  $("#page2").show()
})

$("#viewPopulations").click(function() {
  $("#page1").show()
  $("#page2").hide()
})

