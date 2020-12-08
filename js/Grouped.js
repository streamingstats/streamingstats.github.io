class Grouped {
    constructor() {
        this.groupedIMDB = [];
        this.groupedRT = [];
        this.opt = [ {name:"IMDB"}, {name:"RT"}];
        this.options = [ {name:"IMDB"}, {name:"Rotten Tomatoes"}];

        let chart = d3.select("#chart");
        let bounds = chart.node().getBoundingClientRect();
        this.padding = {top: 20, bottom: 0, left: 30, right: 160};
        this.width = bounds.width;
        this.height = bounds.height - this.padding.top - this.padding.bottom;
        this.h = 0;
        this.margin = 20;
    }

    render(data, count, selections) {
        this.groupedIMDB = [];
        this.groupedRT = [];

        if (selections.dataType === "movies") {
          this.formatData(data, selections.genres, "Genres");
        } else {
          this.formatData(data, selections.ageRange, "Age");
        }

        this.createChart("IMDB");
    }

    formatData(data, options, selectedCategory) {
      let countMap = {
        "Netflix": {"RT": {}, "IMDB": {}},
        "Prime Video": {"RT": {}, "IMDB": {}},
        "Hulu": {"RT": {}, "IMDB": {}},
        "Disney+": {"RT": {}, "IMDB": {}},
      };

      options.forEach(option => {
        for (let child in countMap) {
          countMap[child]["RT"][option] = {grpValue:0, sum:0, count:0};
          countMap[child]["IMDB"][option] = {grpValue:0, sum:0, count:0};
        }
      });
    
      // Calculate averages
      for (let row of data) {
        let categories = row[selectedCategory]
        let categoryArray = categories.split(",");
  
        let emptyIndex = categoryArray.indexOf("")
        if (emptyIndex !== -1) {
            categoryArray.splice(emptyIndex, 1);
        }
  
        for (let category of categoryArray) {
          if (options.indexOf(category) === -1) {
            continue;
          }

          for (let child in countMap) {
            let movieAdded = +row[child] === 1;

            if (movieAdded) {

              let rtScore = row["Rotten Tomatoes"];
              if (rtScore !== "") {
                countMap[child]["RT"][category].count++;
                countMap[child]["RT"][category].sum += +rtScore;
              }
              
              let imdbScore = row["IMDb"];   
              if (imdbScore !== "") {
                countMap[child]["IMDB"][category].count++;
                countMap[child]["IMDB"][category].sum += +imdbScore;
              }             
            }
          }
        }
      }

      options.forEach(option => {
        let rtData = {key: option, values: []};
        let imdbData = {key: option, values: []};
       
        for (let child in countMap) {
          let rt = countMap[child]["RT"][option];
          rt.grpName = child;
          if (rt.count !== 0) {
            rt.grpValue = rt.sum / rt.count;
          } 
          rtData.values.push(rt);

          let imdb = countMap[child]["IMDB"][option];
          imdb.grpName = child;
          if (imdb.count !== 0) {
            imdb.grpValue = imdb.sum / imdb.count;
          } 
          imdbData.values.push(imdb);
        }

        this.groupedRT.push(rtData);
        this.groupedIMDB.push(imdbData)

      });
    }

    createButtons(selected) {
      let buttonDiv = d3.select('#chart')
        .append("div")
        .attr("id", "ratingsButtons")  
      ;
      
      buttonDiv
        .selectAll('button')
        .data(this.options)
        .enter()
        .append("button")
        .classed("selected", d => d.name === selected)
        .text(function(d) {return d.name}).attr('value', function(d) {return d.name})
        .on('click', d => this.createChart(d.name))
      ;
    }

    clearData() {
      d3.select("#chart").selectAll("*").remove();
    }

    createChart(select){
      this.clearData();
      this.createButtons(select);

      let x0  = d3.scaleBand().rangeRound([0, this.width - this.padding.right], .5);
      let x1  = d3.scaleBand();
      let y   = d3.scaleLinear().rangeRound([this.height - this.padding.top * 2 - this.padding.bottom * 2 - this.margin, 0]);

      let xAxis = d3.axisBottom()
        .scale(x0)
      ;

      let yAxis = d3.axisLeft()
        .scale(y);

      let subgroups = ["Netflix", "Prime Video", "Hulu" , "Disney+"];

      let color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#003380','#008040','#808000', '#800000'])

      let svg = d3.select('#chart').append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
        .attr("transform", `translate(${this.padding.left},${this.padding.top})`);

      if (select === "IMDB") {
        let categoriesNames = this.groupedIMDB.map(function(d) { return d.key; });
        let rateNames       = this.groupedIMDB[0].values.map(function(d) { return d.grpName; });

        x0.domain(categoriesNames);
        x1.domain(rateNames).rangeRound([15, x0.bandwidth()]);
        y.domain([0, 10]);

        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", `translate(0,${this.height - (this.padding.top * 2) - this.margin})`)
           .call(xAxis);

        svg.append("g")
           .attr("class", "y axis")
           .style('opacity','0')
           .call(yAxis)
           .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 6)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .style('font-weight','bold')
           .text("Value");

        svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

        let slice = svg.selectAll(".slice")
          .data(this.groupedIMDB)
          .enter().append("g")
          .attr("class", "g")
          .attr("transform", d  => { return `translate(${x0(d.key)},-${(this.padding.top * 2) + this.margin})`; });
                
        slice.selectAll("rect")
            .data(function(d) { return d.values; })
            .enter().append("rect")
            .attr("width", x1.bandwidth())
            .attr("x", function(d) { return x1(d.grpName); })
            .style("fill", function(d) { return color(d.grpName) })
            .attr("y", d => this.height)
            .attr("height", (d) =>  (this.height - (this.padding.top * 2) - this.margin) - y(0))
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color(d.grpName)).darker(2));
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", color(d.grpName));
        });


        slice.selectAll("rect")
          .transition()
          .delay(function (d) {return Math.random()*1000;})
          .duration(1000)
          .attr("y", d => {
            console.log("grpValue", d.grpValue);
            console.log("y value", y(d.grpValue));
            return y(d.grpValue);
          })
          .attr("height", d => this.height - y(d.grpValue));

          svg.append("text")
            .text("IMDB Ratings")
            .attr("transform", `translate(150,${this.h - (this.padding.left / 3)})`)
          ;
      } else {
        let categoriesNames = this.groupedRT.map(function(d) { return d.key; });
        let rateNames       = this.groupedRT[0].values.map(function(d) { return d.grpName; });

        x0.domain(categoriesNames);
        x1.domain(rateNames).rangeRound([15, x0.bandwidth()]);
        y.domain([0, 100]);

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", `translate(0,${this.height - (this.padding.top * 2) - this.margin})`)
          .call(xAxis);

        svg.append("g")
          .attr("class", "y axis")
          .style('opacity','0')
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .style('font-weight','bold')
          .text("Value");

        svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

        let slice = svg.selectAll(".slice")
          .data(this.groupedRT)
          .enter().append("g")
          .attr("class", "g")
          .attr("transform", d  => { return `translate(${x0(d.key)},-${(this.padding.top * 2) + this.margin})`; });


        slice.selectAll("rect")
            .data(function(d) { return d.values; })
            .enter().append("rect")
            .attr("width", x1.bandwidth())
            .attr("x", function(d) { return x1(d.grpName); })
            .style("fill", function(d) { return color(d.grpName) })
            .attr("y", d => this.height)
            .attr("height", (d) =>  (this.height - (this.padding.top * 2) - this.margin) - y(0))
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color(d.grpName)).darker(2));
              })
            .on("mouseout", function(d) {
                  d3.select(this).style("fill", color(d.grpName));
              });

        slice.selectAll("rect")
            .transition()
            .delay(function (d) {return Math.random()*1000;})
            .duration(1000)
            .attr("y", (d) => y(d.grpValue))
            .attr("height", d => this.height - y(d.grpValue));

        svg.append("text")
          .text("Rotten Tomatoes Ratings")
          .attr("transform", `translate(150,${this.h - (this.padding.left / 3)})`)
      }
  
      let legend = svg.selectAll(".legend")
        .data(color.range())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0, ${i * 19 })`);

      legend.append("rect")
            .attr("x", this.width - this.padding.right)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d, i) {
              return color.range()[i]});

      legend.append("text")
            .attr("x", this.width - this.padding.right + 25)
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