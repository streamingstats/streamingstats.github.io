class Profiles {
    constructor() {
        this.data = [];
        this.options = [{val: "profile", text:"Number of Profiles"}, 
                        {val:"screens", text:"Number of Active Streamers"}];
        this.w = 600;
		this.h = 400;
		this.padding = 40;

        d3.csv(`data/profile_cost.csv`, d => {
         this.data.push({"service":d.service,"price":+d.price, "profile_count":+d.profile_count, "screen_count":+d.screen_count})
        })
    }

    render(data, count) {
        console.log(this.data);

        let xScale = d3.scaleLinear()
			           .domain([0, d3.max(this.data, function(d) { return +d.price; })])
            		   .range([this.padding, this.w - this.padding * 2]);

		let yScale = d3.scaleLinear()
			           .domain([0, d3.max(this.data, function(d) { return +d.profile_count; })])
                       .range([this.h - this.padding, this.padding]);

        let xAxis = d3.axisBottom().scale(xScale).tickFormat("");
		
        let yAxis = d3.axisLeft().scale(yScale).tickFormat("");

        let svg = d3.select("#chart")
					.append("svg")
					.attr("width", this.w)
                    .attr("height", this.h);
        
        svg.selectAll("circle")
                    .data(this.data)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) {
                        return xScale(d.price);
                    })
                    .attr("cy", function(d) {
                        return yScale(+d.profile_count);
                    })
                    .attr("r", 5)
                    .attr("class", function(d) { return d.service})
                    .on('mouseover', function(d){ 
                        d3.select(this)
                        .attr('r', '10')
                        .append("svg:title")
                        .text(`${d.service} \nPrice: $${d.price} \nProfile Count: ${d.profile_count}`)
                    })
                    .on('mouseout', function(){
                        d3.select(this)
                          .attr('r', '5')
                    });
                    
        //x axis
        svg.append("g")
            .attr("transform", "translate(0," + (this.h - this.padding) + ")")
            .attr("class", "axis")
            .call(xAxis);
                
        //y axis
        svg.append("g")	
           .attr("transform", "translate(" + this.padding + ", 0)")
           .attr("class", "axis")
           .call(yAxis);

        svg = d3.select("#chart")
		     	.append("svg")
				.attr("width", this.w)
                .attr("height", this.h);
        
        yScale = d3.scaleLinear()
                   .domain([0, d3.max(this.data, function(d) { return +d.screen_count; })])
                   .range([this.h - this.padding, this.padding]);

        yAxis = d3.axisLeft().scale(yScale).tickFormat("");
        svg.selectAll("circle")
                    .data(this.data)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) {
                        return xScale(d.price);
                    })
                    .attr("cy", function(d) {
                        return yScale(+d.screen_count);
                    })
                    .attr("r", 5)
                    .attr("class", function(d) { return d.service})
                    .on('mouseover', function(d){ 
                        d3.select(this)
                        .attr('r', '10')
                        .append("svg:title")
                        .text(`${d.service} \nPrice: $${d.price} \nScreen Count: ${d.screen_count}`)
                    })
                    .on('mouseout', function(){
                        d3.select(this)
                          .attr('r', '5')
                    });;
                    
        //x axis
        svg.append("g")
            .attr("transform", "translate(0," + (this.h - this.padding) + ")")
            .attr("class", "axis")
            .call(xAxis);
                
        //y axis
        svg.append("g")	
           .attr("transform", "translate(" + this.padding + ", 0)")
           .attr("class", "axis")
           .call(yAxis);
    }
}