function genData_remun(selector) {
    const margin = {top: 30, right: 30, bottom: 70, left: 60},
            width = 800 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

    const svg = d3.select(selector)
    .append("svg")
        //.attr("width", width + margin.left + margin.right)
        //.attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 800 500`)
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.json("data/remun-orgaos.json").then ( function(data) {

        data.sort(function(b, a) {
            return a.remunMedia - b.remunMedia;
        });

        const color = (min, max) => {return Math.random() * (max - min) + max};

        const x = d3.scaleBand()
            .range([ 0, width ])
            .domain(data.map(d => d.id))
            .padding(0.2);
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        const y = d3.scaleLinear()
            .domain([1000, 18000])
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(d => "R$" + d / 1000 + ".000"));

        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => x(d.id))
            .attr("y", d => y(d.remunMedia))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.remunMedia))
            .attr("fill", function(d) { return `rgb(110,${color(0,130)},${color(0,130)})` });
    });
};