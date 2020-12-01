// Sunburst Process borrowed and modified from the following sources:

// https://jsfiddle.net/qo1vwL6k/1/
// https://vizhub.com/syahidibnoe/e23bf11ce7234df38c3d01eb9439fb32

class Sunburst {
    constructor() {
      this.burst = {
        name: "flare",
        children: [
          {name:"Netflix", children:[]},
          {name:"Amazon Prime", children:[]},
          {name:"Hulu", children:[]},
          {name:"Disney", children:[]}
        ]
      };
      this.util = new Util();
      this.format = d3.format(",d");
      let chart = d3.select("#chart");
      let bounds = chart.node().getBoundingClientRect();
      this.width = bounds.width;
      this.height = bounds.height;

      let smallerValue = this.width < this.height ? this.width : this.height;
      this.radius = smallerValue / 5;

      this.partition = data => {
        const root = d3.hierarchy(data)
                .sum(d => d.size)
                .sort((a, b) => b.value - a.value);
        return d3.partition()
                .size([2 * Math.PI, root.height])
                (root);
    }

      this.arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(this.radius * 1.5)
        .innerRadius(d => d.y0 * this.radius)
        .outerRadius(d => Math.max(d.y0 * this.radius, d.y1 * this.radius - 1));
    }

    render(data, counts, genres) {
      this.formatData(data, genres);
      console.log(this.burst);
      this.createChart();
    }

    formatData(data, genres) {

      genres.forEach(genre => {
        this.burst.children[0]['children'].push({name:genre, size:0});
        this.burst.children[1]['children'].push({name:genre, size:0});
        this.burst.children[2]['children'].push({name:genre, size:0});
        this.burst.children[3]['children'].push({name:genre, size:0});
      });

      for (let i = 0; i < data.length; i++)
      {
          let category = data[i]['Genres']
          let genreArray = category.split(",");
          let emptyIndex = genreArray.indexOf("")
          if (emptyIndex !== -1) {
              genreArray.splice(emptyIndex, 1);
          }

          for (let j = 0; j < genreArray.length; j++)
          {
              for (let k = 0; k < genres.length; k++)
              {
                  if (genres[k] == genreArray[j])
                  {
                    if (data[i]['Netflix'] == "1")
                    {
                      this.burst.children[0]['children'][k]['size'] += 1;
                    }
                    if (data[i]['Disney+'] == "1")
                    {
                      this.burst.children[1]['children'][k]['size'] += 1;
                    }
                    if (data[i]['Hulu'] == "1")
                    {
                      this.burst.children[2]['children'][k]['size'] += 1;
                    }
                    if (data[i]['Prime Video'] == "1")
                    {
                      this.burst.children[3]['children'][k]['size'] += 1;
                    }
                  }
              }
          }
      }
    }

    createChart() {
      let root = this.partition(this.burst);
      console.log(root);
      const color = d3.scaleOrdinal().range(d3.quantize(d3.interpolateRainbow, this.burst.children.length + 1));
      const nodesWithParents = root.descendants().slice(1);
      root.each(d => d.current = d);

      const svg = d3.select('#chart')
        .append("svg")
        .style("width", "100%")
        .style("height", "100%")
        .style("font", "10px sans-serif");

      const g = svg.append("g")
        .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`)

      const path = g.append("g")
        .selectAll("path")
        .data(nodesWithParents)
        .enter()
        .append("path")
        .attr("fill", d => {
            while (d.depth > 1)
                d = d.parent;
            return color(d.data.name);
        })
        // .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("d", d => this.arc(d.current));

      path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

      path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${this.format(d.value)}`);

      const label = g.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current, this.radius))
        .text(d => d.data.name);

      let parent = g.append("circle")
            .datum(root)   
            .attr("r", this.radius)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .attr("cursor", "pointer")
            .on("click", clicked);

      let radius = this.radius;
      let arc = this.arc;

      function clicked(p) {
        console.log(p);
        console.log(parent);
        parent.datum(p.parent || root);
    
        root.each(d => d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            });
    
        const t = g.transition().duration(750);

    
        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        path.transition(t)
                .tween("data", d => {
                    const i = d3.interpolate(d.current, d.target);
                    return t => d.current = i(t);
                })
                .filter(function (d) {
                    return +this.getAttribute("fill-opacity") || arcVisible(d.target);
                })
                .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
                .attrTween("d", d => () => arc(d.current));
    
        label.filter(function (d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
                .attr("fill-opacity", d => +labelVisible(d.target))
                .attrTween("transform", d => () => labelTransform(d.current, radius));
      }

      function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
      }
    
      function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
      }
    
      function labelTransform(d, radius) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      }
  
    }
}