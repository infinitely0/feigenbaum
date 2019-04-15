$(document).ready(function() {
  initPopsGraph()
})

const margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
}

const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

function initPopsGraph() {
  let x = d3.scaleLinear()
    .range([0, width])
    .domain([0, 100])

  let y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 1])

  let svg = d3.select(".populationsChart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  let line = d3.line()
  data = [ { generation: 0, population: 0 } ]

  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", line)

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr('class', 'x')
      .call(d3.axisBottom(x))

  svg.append("g")
      .attr('class', 'y')
      .call(d3.axisLeft(y))
}

function initBifurcationsGraph() {
  let x = d3.scaleLinear()
    .range([0, width])
    .domain([0, 4])

  let y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 1])

  let svg = d3.select(".bifurcationsChart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr('class', 'x')
      .call(d3.axisBottom(x))

  svg.append("g")
      .attr('class', 'y')
      .call(d3.axisLeft(y))
}

function drawPops(lambda, gens) {
  $.get("/populations/" + lambda + "/" + gens, function(res) {
    let data = res.slice(1,-1).split(" ")

    let x = d3.scaleLinear()
    .range([0, width])
    .domain([0, 100])

    let y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 1])

    let stablePops = new Set(data.slice(-100, -1))
    $("#periodicity").text(stablePops.size)
    $("#stablePops").html(Array.from(stablePops).join("<br>"))

    data.forEach(function(val, i) {
      data[i] = { generation: i, population: val }
    })

    x.domain([0, d3.max(data.map(function(d) { return d.generation }))])

    let line = d3.line()
      .x(function(d) { return x(d.generation) })
      .y(function(d) { return y(d.population) })

    let svg = d3.select(".populationsChart")

    svg.select(".line")
        .transition()
        .duration(750)
        .attr("d", line(data))

    svg.selectAll(".x")
        .transition()
        .duration(750)
        .call(d3.axisBottom(x))
  })
}

function drawBifurcations(start, end, step) {
  $.get("/bifurcations/" + start + "/" + end + "/" + step, function(res) {

    let data = JSON.parse(res)

    data = data.reduce(function(a, c) {
      return a.concat(c.populations.map(function(d) {
        return {
          lambda: c.lambda,
          population: d
        }
      }))
    }, [])

    let x = d3.scaleLinear()
      .range([0, width])
      .domain([start, end])

    let y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 1])

    let svg = d3.select(".bifurcationsChart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    d3.select(".bifurcationsChart")
        .selectAll(".x")
        .transition()
        .duration(750)
        .call(d3.axisBottom(x))

    d3.selectAll("circle").remove()

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", function(d){ return x(d.lambda) })
            .attr("cy", function(d){ return y(d.population) })
            .attr("r", 2)
            .attr("fill", "white")
            .attr("opacity", 0)
        .transition().delay(function(d, i) { return i * 10 })
            .attr("opacity", 100)
  })
}

$("#drawPops").click(function() {
  let lambda = $("#lambda").val()
  let gens = $("#generations").val()

  drawPops(lambda, gens)
})

$('input[type=range]').change(function(){
  let lambda = $(this).val()
  $("#lambda_value").text(lambda)

  drawPops(lambda, 200)
})

$("#drawBifurcations").click(function() {
  let start = $("#startLambda").val()
  let end = $("#endLambda").val()
  let step = $("#step").val()
  drawBifurcations(start, end, step)
})

$("#viewBifurcations").click(function() {
  initBifurcationsGraph()
  $("#page1").hide()
  $("#page2").show()
})

$("#viewPopulations").click(function() {
  $("#page1").show()
  $("#page2").hide()
})

