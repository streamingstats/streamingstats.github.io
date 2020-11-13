class Bar {
    constructor() {
        let chart = d3.select("#chart");
        let bounds = chart.node().getBoundingClientRect();
        console.log(bounds);
        this.width = bounds.width;
        this.height = bounds.height;
        this.padding = 30;
    }

    render(data, count) {

        let countArray = [];
        for (let service in count) {
            countArray.push({"service": service, "count": count[service]});
        }

        let chart = d3.select("#chart")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
        ;

        let g = chart
            .append("g")
            .attr("transform", `translate(${this.padding}, -${this.padding})`)
        ;

        let currentRectangles = g
            .selectAll("rect")
            .data(countArray)
        ;

        let xAxis = d3.scaleBand()
            .range([this.padding, this.width - (this.padding * 2)])
            .padding(0.1)
            .domain(countArray.map(d => d.service));
        ;

        let yAxis = d3.scaleLinear()
            .range([this.height, this.padding * 2])
            .domain([0, d3.max(countArray, d => d.count)])
        ;

        currentRectangles
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xAxis(d.service))
            .attr("y", d => yAxis(d.count))
            .attr("width", xAxis.bandwidth())
            .attr("height", d => this.height - yAxis(d.count))
            .attr('id', d => d.service)
            .on('mouseover', function(d) { 
                d3.select(this)
                    .style('fill', '#030d17')
            })
            .on('mouseout', function() {
                d3.select(this)
                    .style("fill", "")
            })
        ;

        d3.selectAll("#chart > svg > g > rect")
            .html("")
            .append("title")
            .text(d => `${d.count}`)
        ;

        g.append("g")
            .classed("axis", true)
            .attr("transform", `translate(0, ${this.height})`)
            .call(d3.axisBottom(xAxis))
        ;

        g.append("g")
            .classed("axis", true)
            .attr("transform", `translate(${this.padding}, 0)`)
            .call(d3.axisLeft(yAxis))
            .selectAll("text")
            .attr("x", -15)
        ;
    }
}