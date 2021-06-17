    function genData_vac(selector) {
    var margin = {top: 10, right: 20, bottom: 30, left: 50},
            width = 500 - margin.left - margin.right,
            height = 350 - margin.top - margin.bottom;

    var svg = d3.select(selector)
        .append("svg")
            //.attr("width", width + margin.left + margin.right)
            //.attr("height", height + margin.top + margin.bottom)
            .attr("viewBox", `0 0 500 350`)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    d3.json("data/vacinas.json", function(data) {

        var x = d3.scaleLinear()
            .domain([0, 40])
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d => d + "%"));

        var y = d3.scaleLinear()
            .domain([0, 40])
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(d => d + "%"));

        var z = d3.scaleLinear()
            .domain([40000, 2600000])
            .range([ 4, 40]);

        var color = (min, max) => {return Math.random() * (max - min) + max};

        var tooltip = d3.select(selector)
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")

        var showTooltip = function(d) {
            tooltip
            .transition()
            .duration(200)
            tooltip
            .style("opacity", 1)
            .html(d.municipio + "<br>" + 
                `Primeira dose: ${(d.dose1/ d.pop * 100).toFixed(2)}%` + "<br>" +
                `Segunda dose: ${(d.dose2/ d.pop * 100).toFixed(2)}%`)
            .style("left", (d3.mouse(this)[0]+30) + "px")
            .style("top", (d3.mouse(this)[1]+30) + "px")
        }
        var moveTooltip = function(d) {
            tooltip
            .style("left", (d3.mouse(this)[0]+270) + "px")
            .style("top", (d3.mouse(this)[1]+250) + "px")
        }
        var hideTooltip = function(d) {
            tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
        }

        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "bubbles")
            .attr("cx", function (d) { return x(d.dose1 / d.pop * 100); } )
            .attr("cy", function (d) { return y(d.dose2 / d.pop * 100); } )
            .attr("r", function (d) { return z(d.pop); } )
            .style("fill", function (d) { return `rgb(110,${color(0,130)},${color(0,130)})` } )
            .on("mouseover", showTooltip )
            .on("mousemove", moveTooltip )
            .on("mouseleave", hideTooltip )
    });
};