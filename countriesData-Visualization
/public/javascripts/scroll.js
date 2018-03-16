var select_list = ["GDP growth (annual %)", "GDP (current US$)", "Internet users (per 100 people)", "Rural population",
        "Population, female (% of total)", "Population growth (annual %)", "Population, total", "GDP per capita growth (annual %)",
        "GDP per capita (current US$)", "Laborforce,total", "Laborforce,female(%oftotallaborforce)",
        "Armedforcespersonnel (% of total labor force)", "Surface area (sq. km)",
        "Population density (people per sq. km of land area)", "Arableland(%oflandarea)",
        "Unemployment,total(%oftotallaborforce)(modeledILO estimate)",
        "Unemployment, female (% of female labor force) (modeled ILO estimate)"
    ],
    tooptip = d3.select("body")
    .append("div")
    .attr("class", "tooptip")
    .style("opacity", 0.0),
    f_rect = 30,
    s_rect = 120,
    t_rect = 314 - f_rect - s_rect,
    country_data, name = "az",
    map_flag = -1,
    axis_svg, first_scan, second_scan;

for (var i = 0; i < 17; i++)
    $("#f_select,#s_select,#t_select,#forth_select").append("<option value='" + (i + 1) + "'>" + select_list[i] + "</option>")
$("#f_select,#s_select,#t_select,#forth_select").chosen({
    width: "320px"
});
file_read();

$('#year_select').chosen({
    disable_search_threshold: 10,
    width: "1300px"
});



inital();
map();

function inital() {
    prepare("#f_select", ".viewport");
    prepare("#s_select", ".viewport2");
    prepare("#t_select", ".viewport3");
    prepare("#forth_select", ".viewport4");
}

function prepare(select, view) {
    var tmp = d3.select(view).selectAll("svg");
    tmp.remove();
    file(parseInt($("#year_select").val()), parseInt($(select).val()), view);
}

function quickSort(s, l, r) {
    if (l < r) {
        var i = l,
            j = r,
            x = s[l];
        while (i < j) {
            while (i < j && (parseFloat(s[j].value) < parseFloat(x.value)))
                j--;
            if (i < j)
                s[i++] = s[j];
            while (i < j && (parseFloat(s[i].value) >= parseFloat(x.value)))
                i++;
            if (i < j)
                s[j--] = s[i];
        }
        s[i] = x;
        quickSort(s, l, i - 1);
        quickSort(s, i + 1, r);
    }
}

function draw(view, data, max, min, property) {
    var SVG = d3.select(view).append("svg");
    var g = SVG.append("g");

    var rowEnter = function(rowSelection) {

        rowSelection.append("rect")
            .attr("width", f_rect)
            .attr("height", "30")
            .attr("fill-opacity", 0.25)
            .attr("fill", function(d) {
                return (d.index % 2 == 1) ? "white" : "black";
            });

        rowSelection.append("rect")
            .attr("width", s_rect)
            .attr("height", "30")
            .attr("fill-opacity", 0.25)
            .attr("fill", function(d) {
                return (d.index % 2 == 1) ? "white" : "black";
            })
            .attr("transform", "translate(" + (f_rect + 3) + ",0)");

        rowSelection.append("rect")
            .attr("width", t_rect)
            .attr("height", "30")
            .attr("fill-opacity", 0.25)
            .attr("fill", function(d) {
                return (d.index % 2 == 1) ? "white" : "black";
            })
            .attr("transform", "translate(" + (f_rect + 4 + s_rect) + ",0)");

        rowSelection.append("rect")
            .attr("width", function(d) {
                if (max == 0) {
                    d.flag = -1;
                    return 0;
                }
                var tmp = (t_rect / max) * d.value;
                d.flag = (tmp < 0) ? -1 * tmp : -1;
                return ((d.flag > 0) ? d.flag : tmp);
            })
            .attr("height", "26")
            .attr("fill-opacity", 0.45)
            .attr("fill", function(d) {
                return "red";
            })
            .attr("transform", function(d) {
                if (d.flag < 0)
                    return "translate(" + (f_rect + 4 + s_rect) + ",2)";
                return "translate(" + (f_rect + 4 + s_rect - d.flag) + ",2)";
            });
        rowSelection.append("rect")
            .attr("width", "320")
            .attr("height", "30")
            .attr("fill-opacity", 0.4)
            .attr("fill", function(d) {
                if (d.ab == name) return "steelblue";
                return "white";
            })
            .on("click", function(d) {
                name = d.ab;
                d3.select("#map_svg").remove();
                map();
                d3.select("#axis_svg").remove();
                draw_axis(max, min, property, d.name);
                inital();
            })
            .on("mouseover", function(d) {
                d3.select(this)
                    .attr("fill-opacity", 0.4)
                    .attr("fill", "yellow");
                tooptip.html("Country: " + d.name + " <br>" + "value: " + d.value)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("background-color", "Ivory")
                    .style("opacity", 1.0);
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .attr("fill-opacity", 0.4)
                    .attr("fill", function(d) {
                        if (d.ab == name) return "steelblue";
                        return "white";
                    });
                tooptip.style("opacity", 0.0);
            });
        rowSelection.append("text")
            .attr("transform", "translate(5,15)")
            .text(function(d, i) {
                return (d.index + 1);
            });
        rowSelection.append("text")
            .attr("transform", "translate(" + (3 + f_rect) + ",15)")
            .text(function(d, i) {
                return d.name;
            });
    };

    var rowUpdate = function(rowSelection) {};

    var rowExit = function(rowSelection) {};

    var virtualScroller = d3.VirtualScroller()
        .rowHeight(30)
        .enter(rowEnter)
        .update(rowUpdate)
        .exit(rowExit)
        .svg(SVG)
        .totalRows(215)
        .viewport(d3.select(view));

    data.forEach(function(nextState, i) {
        nextState.index = i;
    });

    virtualScroller.data(data, function(d) {
        return d.id;
    });

    g.call(virtualScroller);
}

function file_read() {
    $.ajax({
        dataType: "text",
        url: "/data/countriesData.txt",
        async: false,
        success: function(data) { country_data = data; }
    });
    country_data = country_data.replace(/"/g, "");
    country_data = country_data.toString().split("\n");
    for (var i = 0; i < country_data.length; i++) {
        country_data[i] = country_data[i].toString().split(",");
    }
    // var country_list = new Array(220);
    // for (i = 0; i < 215; i++) {
    //      country_list[i] = country_data[1 + 17 * i][1];
    //  }
    for (var i = 0; i < 215; i++)
        $("#map_select").append("<option value='" + country_data[1 + 17 * i][1] + "'>" + country_data[1 + 17 * i][0] + "</option>")
    $('#map_select').chosen({
        width: "300px"
    });
}

function file(year, property, view) {
    //d3.text("/data/countriesData.txt", function(error, data) {
    //   if (error) console.log(error);
    //  else {
    //    data = data.toString().split("\n");

    //      for (var i = 0; i < data.length; i++) {
    //         data[i] = data[i].toString().split(",");
    //     }

    function Country() {}
    Country.prototype.name = "A";
    Country.prototype.value = 4;
    Country.prototype.id = 4;
    Country.prototype.ab = "cha";
    Country.prototype.flag = 1;


    var Country_class = new Array(),
        max, min;

    for (i = 0; i < 215; i++) {
        Country_class[i] = new Country();
        Country_class[i].value = country_data[property + 17 * i][country_data[property + 17 * i].length - 1 - year];
        if (Country_class[i].value[0] == ".") Country_class[i].value = 0;
        Country_class[i].name = country_data[property + 17 * i][0];
        Country_class[i].id = i;
        Country_class[i].ab = country_data[property + 17 * i][1];
        Country_class[i].flag = 1;

        if (i == 0) {
            max = Country_class[i].value;
            min = Country_class[i].value;
        }
        if (parseFloat(max) < parseFloat(Country_class[i].value)) max = parseFloat(Country_class[i].value);
        if (parseFloat(min) > parseFloat(Country_class[i].value)) min = parseFloat(Country_class[i].value);

    }
    //   console.log(max);
    quickSort(Country_class, 0, 214);
    //  console.log(Country_class)
    draw(view, Country_class, max, min, property);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////


function map() {
    var width = 800,
        height = 700,
        zoom = d3.behavior.zoom()
        .scaleExtent([1, 100])
        .on("zoom", function(d) {
            d3.select(this).attr("transform", "translate(" + d3.event.translate + ")" +
                "scale(" + d3.event.scale + ")");
        }),
        map_svg = d3.select("body").append("svg")
        .attr("id", "map_svg")
        .attr("width", width)
        .attr("height", height),
        groups = map_svg.append("g")
        .call(zoom);

    map_svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("stroke", "black")
        .attr("stroke-width", 0)
        .attr("fill", "none");

    var projection = d3.geo.mercator()
        .center([1, 77])
        .scale(80)
        .translate([width / 2, 400]);
    var path = d3.geo.path()
        .projection(projection);
    d3.json("/data/countries.geo.json", function(error, root) {
        if (error) alert("error");
        console.log(root);
        groups.selectAll("path")
            .data(root.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", function(d) {
                if (d.id == name) return "steelblue";
                else return "grey";
            })
            .on("mouseover", function(d, i) {
                // d3.select(this).style("fill", "steelblue")
                tooptip.html("Country: " + d.properties.name)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("background-color", "Ivory")
                    .style("opacity", 1.0);
            })
            .on("mouseout", function(d, i) {
                // if (map_flag < 0) {
                // d3.select(this).style("fill", "E7E1E1");
                // }
                tooptip.style("opacity", 0);
            })
            .on("click", function(d) {
                // if (map_flag > 0) {
                //  d3.select(this).style("fill", "E7E1E1");
                //    map_flag = -1;
                //  } else {
                // d3.select(this).style("fill", "steelblue")
                //   map_flag = 1;
                name = d.id;
                d3.select("#map_svg").remove();
                map();
                d3.select("#axis_svg").remove();
                draw_axis(10, 0, -1, "qw");
                inital();

                //}
            });
    });
}

function draw_axis(max, min, property, cou_name) {
    console.log(max);
    axis_svg = d3.select("body").append("svg")
        .attr("id", "axis_svg")
        .attr("width", 620)
        .attr("height", 600);
    axis_svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 600)
        .attr("height", 600)
        .attr("stroke", "black")
        .attr("stroke-width", 0)
        .attr("fill", "none");

    var yScale = d3.scale.linear()
        .domain([min, max])
        .range([0, 200]);
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(8)
        .orient("left");
    yScale.range([200, 0]);

    var xScale = d3.scale.linear()
        .domain([2010, 2015])
        .range([0, 400]);
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(5);

    var gAxis = axis_svg.append("g").attr("transform", "translate(110,500)");
    var g1Axis = axis_svg.append("g").attr("transform", "translate(110,300)");

    gAxis.call(xAxis);
    g1Axis.call(yAxis);
    if (property < 0) return;
    var g = axis_svg.append("g");
    var xData = new Array(5),
        yData = new Array(5);
    for (var i = 0; i < 5; i++) {
        xData[i] = 110 + 100 * i;
    }
    for (var index = 0; index < 215; index++) {
        for (var i = 0; i < 5; i++) {
            yData[i] = country_data[property + 17 * index][country_data[property + 17 * index].length - 1 - i];
            if (yData[i][0] == ".") yData[i] = 0;
            yData[i] = (yData[i] - min) / (max - min) * 200;
            yData[i] = 500 - yData[i];
        }
        for (var i = 0; i < 4; i++) {
            if (country_data[property + 17 * index][0] == cou_name) {
                g.append("line")
                    .attr("x1", xData[i])
                    .attr("y1", yData[i])
                    .attr("x2", xData[i + 1])
                    .attr("y2", yData[i + 1])
                    .attr("stroke", "red")
                    .attr("opacity", 1)
                    .attr("stroke-width", 2)
                    .attr("fill", "none")
            } else
                g.append("line")
                .attr("x1", xData[i])
                .attr("y1", yData[i])
                .attr("x2", xData[i + 1])
                .attr("y2", yData[i + 1])
                .attr("stroke", "grey")
                .attr("opacity", 0.3)
                .attr("stroke-width", 1)
                .attr("fill", "none")

        }
    }
}
draw_axis(10, 0, -1, "qw")

function update(select, view) {
    $(select).bind("change", function() {
        var tmp = d3.select(view).selectAll("svg");
        tmp.remove();
        file(parseInt($("#year_select").val()), parseInt($(select).val()), view);
    });
}

function update_year(select, view) {
    $("#year_select").bind("change", function() {
        var tmp = d3.select(view).selectAll("svg");
        tmp.remove();
        file(parseInt($("#year_select").val()), parseInt($(select).val()), view);
    });
}

function update_map() {
    $("#map_select").bind("change", function() {
        name = $("#map_select").val();
        d3.select("#map_svg").remove();
        map();
        d3.select("#axis_svg").remove();
        draw_axis(10, 0, -1, "qw")

        inital();
    });
}
update_map();
update("#f_select", ".viewport");
update("#s_select", ".viewport2");
update("#t_select", ".viewport3");
update("#forth_select", ".viewport4");
update_year("#f_select", ".viewport");
update_year("#s_select", ".viewport2");
update_year("#t_select", ".viewport3");
update_year("#forth_select", ".viewport4");