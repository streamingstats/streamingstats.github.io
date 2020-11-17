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
        
        svg.append("text")
        .text("Profile Count in Comparison to Price")
        .attr("transform", "translate("+ 150 + "," + (this.h - (this.padding / 3)) + ")")

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
        
       svg.append("text")
          .text("Screen Count in Comparison to Price")
          .attr("transform", "translate("+ 150 + "," + (this.h - (this.padding / 3)) + ")")
        
        svg = d3.select("#chart")
                .append("svg")
                .attr("width", this.w / 2)
                .attr("height", this.h / 2);

        let subgroups = ["Netflix", "Prime", "Hulu" , "Disney"];
        let color = d3.scaleOrdinal()
                      .domain(subgroups)
                      .range(['#3385ff','#0052cc','#003d99', '#66a3ff'])

        let legend = svg.selectAll(".legend")
                        .data(color.range())
                        .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function(d, i) { return "translate(-225," + i * 19 + ")"; });
      
        legend.append("rect")
              .attr("x", this.w / 2 - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", function(d, i) {
                  return color.range()[i]});
           
        legend.append("text")
              .attr("x", this.w / 2 + 5)
              .attr("y", 9)
              .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function(d, i) { 
              switch (i) {
                case 0: return "Netflix";
                case 1: return "Amazon Prime";
                case 2: return "Hulu";
                case 3: return "Disney+";
              }
            });
    }
}