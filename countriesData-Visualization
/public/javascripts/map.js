function map() {
    var map_svg = d3.select("body").append("svg")
        .attr("width", 600)
        .attr("height", 600)

    var projection = d3.geo.mercator()
        .center([107, 31])
        .scale(300)
        .translate([300, 300]);
    var path = d3.geo.path()
        .projection(projection);
    d3.json("/data/countries.geo.json", function(error, root) {
        if (error) alert("error");
        console.log(root);
        var groups = map_svg.append("g");
        groups.selectAll("path")
            .data(root.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .style("fill", function(d, i) {
                console.log(d.geometry.coordinates)
                return "grey";
            })
            .attr("d", path)
            .on("mouseover", function(d, i) {
                d3.select(this).style("fill", "steelblue")
            })
            .on("mouseout", function(d, i) {
                d3.select(this).style("fill", "grey");
            })


    })
    map_svg.append("line")
        .attr("x1", 12)
        .attr("y1", 12)
        .attr("x2", 100)
        .attr("y2", 100)
        .attr("stroke", "black")
        .attr("stroke-width", 3);
}
map();