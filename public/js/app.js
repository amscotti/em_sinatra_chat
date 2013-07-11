var width  = 1800,
height = 1600;
var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height );

var projection = d3.geo.albersUsa();
var states = svg.append('g')
.attr('id', 'states');
states.attr("transform", "scale(1, 1)");

d3.json('/js/json/us-states.json', function(collection) {
  states.selectAll('path')
  .data(collection.features)
  .enter().append('path')
  .attr('d', d3.geo.path().projection(projection))
  .attr('id', function(d){return d.properties.name.replace(/\s+/g, '')})
  .attr('fill', 'gray')
  .attr('stroke', 'white')
  .attr('stroke-width', '1')
});

coords = projection([-122.926547,45.725029])
svg.append("circle")
.attr("cx", coords[0])
.attr("cy", coords[1])
.attr("r", 10)
.style("fill", 'red');

//d3.select("body button").on("click", function() {
  //svg.selectAll(".select").remove();

  //svg.selectAll(".select")
  //.data(coords)
  //.enter().append("circle")
  //.attr("class", "select")
  //.attr("cx", coords[0])
  //.attr("cy", coords[1])
  //.attr("r", 2)
  //.style("fill", "none")
  //.style("stroke", "red")
  //.style("stroke-opacity", 1e-6)
  //.style("stroke-width", 3)
  //.transition()
  //.duration(750)
  //.attr("r", 42)
  //.style("stroke-opacity", 1)
  //.selectAll(".select").remove();

//})
