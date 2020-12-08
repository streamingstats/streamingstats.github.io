class Grouped {
    constructor() {
        this.groupedIMDB = [];
        this.groupedRT = [];
        this.opt = [ {name:"IMDB"}, {name:"RT"}]
        this.h = 0;
        this.padding = 0;
    }

    render(data, count, selections) {
        this.groupedIMDB = [];
        this.groupedRT = [];

        if (selections.dataType === "movies") {
          this.formatData(data, selections.genres, "Genres");
        } else {
          this.formatData(data, selections.ageRange, "Age");
        }

        this.createChart();
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

    createChart(){
        let margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 800 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        let x0  = d3.scaleBand().rangeRound([0, width], .5);
        let x1  = d3.scaleBand();
        let y   = d3.scaleLinear().rangeRound([height, 0]);

        let xAxis = d3.axisBottom().scale(x0)
                                   .tickValues(this.groupedIMDB.map(d=>d.key));

        let yAxis = d3.axisLeft().scale(y);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        let svg = d3.select('#chart').append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
<<<<<<< HEAD

=======
>>>>>>> 9b3b7a4b39a16f757dec6b07c5bccf0b93820b34
        let categoriesNames = this.groupedIMDB.map(function(d) { return d.key; });
        let rateNames       = this.groupedIMDB[0].values.map(function(d) { return d.grpName; });

        x0.domain(categoriesNames);
        x1.domain(rateNames).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(this.groupedIMDB, function(key) { return d3.max(key.values, function(d) { return d.grpValue; }); })]);

        svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
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
                       .attr("transform",function(d) { return "translate(" + x0(d.key) + ",0)"; });

      slice.selectAll("rect")
           .data(function(d) { return d.values; })
           .enter().append("rect")
           .attr("width", x1.bandwidth())
           .attr("x", function(d) { return x1(d.grpName); })
           .style("fill", function(d) { return color(d.grpName) })
           .attr("y", function(d) { return y(0); })
           .attr("height", function(d) { return height - y(0); })
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
      .attr("y", function(d) { return y(d.grpValue); })
      .attr("height", function(d) { return height - y(d.grpValue); });

      svg.append("text")
         .text("IMDB Ratings")
         .attr("transform", "translate("+ 150 + "," + (this.h - (this.padding / 3)) + ")")

      svg = d3.select('#chart').append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      categoriesNames = this.groupedRT.map(function(d) { return d.key; });
      rateNames       = this.groupedRT[0].values.map(function(d) { return d.grpName; });

    x0.domain(categoriesNames);
    x1.domain(rateNames).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(this.groupedRT, function(key) { return d3.max(key.values, function(d) { return d.grpValue; }); })]);

    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
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

    slice = svg.selectAll(".slice")
               .data(this.groupedRT)
               .enter().append("g")
               .attr("class", "g")
               .attr("transform",function(d) { return "translate(" + x0(d.key) + ",0)"; });

    slice.selectAll("rect")
         .data(function(d) { return d.values; })
         .enter().append("rect")
         .attr("width", x1.bandwidth())
         .attr("x", function(d) { return x1(d.grpName); })
         .style("fill", function(d) { return color(d.grpName) })
         .attr("y", function(d) { return y(0); })
         .attr("height", function(d) { return height - y(0); })
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
         .attr("y", function(d) { return y(d.grpValue); })
         .attr("height", function(d) { return height - y(d.grpValue); });

    svg.append("text")
       .text("Rotten Tomatoes Ratings")
       .attr("transform", "translate("+ 150 + "," + (this.h - (this.padding / 3)) + ")")

      //Legend
  let legend = svg.selectAll(".legend")
      .data(this.groupedRT[0].values.map(function(d) { return d.grpName; }).reverse())
  .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
      .style("opacity","0");

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return color(d); });

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {return d; });

  legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
    }
}