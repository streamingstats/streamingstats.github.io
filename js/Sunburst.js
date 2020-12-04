// Sunburst Process borrowed and modified from the following sources:

// https://jsfiddle.net/qo1vwL6k/1/
// https://vizhub.com/syahidibnoe/e23bf11ce7234df38c3d01eb9439fb32

class Sunburst {
  eventMethods = {
    arcVisible: function(d) {
      return d.y1 <= 2 && d.y0 >= .65 && d.x1 > d.x0;
    },
  
    labelVisible: function(d) {
      return d.y1 <= 2 && d.y0 >= .65 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    },
  
    labelTransform: function(d, radius) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    },
  }

  partition = data => {
    const root = d3.hierarchy(data)
            .sum(d => d.size)
            .sort((a, b) => b.value - a.value);
    return d3.partition()
            .size([2 * Math.PI, root.height])
            (root);
  }

  constructor() {
    this.util = new Util();
    this.format = d3.format(",d");
    let chart = d3.select("#chart");
    let bounds = chart.node().getBoundingClientRect();
    this.width = bounds.width;
    this.height = bounds.height;

    let smallerValue = this.width < this.height ? this.width : this.height;
    this.radius = smallerValue / 5;

    this.eventMethods.arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(this.radius * 1.5)
        .innerRadius(d => d.y0 * this.radius)
        .outerRadius(d => Math.max(d.y0 * this.radius, d.y1 * this.radius - 1))
    ;
  }

  render(data, counts, selections) {
    this.burst = {
      name: selections.dataType,
      children: [
        {name:"Netflix", children:[]},
        {name:"Prime Video", children:[]},
        {name:"Hulu", children:[]},
        {name:"Disney+", children:[]}
      ]
    };

    if (selections.dataType === "movies") {
      this.formatData(data, selections.genres, "Genres");
    } else {
      this.formatData(data, selections.ageRange, "Age");
    }
    this.createChart();
  }

  formatData(data, options, selectedCategory) {
    let countMap = {
      "Netflix": {},
      "Prime Video": {},
      "Hulu": {},
      "Disney+": {},
    };
    
    options.forEach(option => {
      for (let child in countMap) {
        countMap[child][option] = 0;
      }
    });

    for (let row of data) {
      let categories = row[selectedCategory]
      let categoryArray = categories.split(",");

      let emptyIndex = categoryArray.indexOf("")
      if (emptyIndex !== -1) {
          categoryArray.splice(emptyIndex, 1);
      }

      // console.log(categoryArray);
      for (let category of categoryArray) {
        if (options.indexOf(category) === -1) {
          continue;
        }

        for (let child in countMap) {
          countMap[child][category] += +row[child];
        }
      }
    }

    for (let child of this.burst.children) {
      for (let category in countMap[child.name]) {
        child['children'].push({name: category, size: countMap[child.name][category]});
      }
    }
  }

  createChart() {
    let root = this.partition(this.burst);
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

    g.append("circle")
      .datum(root)   
      .attr("style", "z-index:-1")
      .attr("r", this.radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .attr("cursor", "pointer")
      .on("click", event => this.clicked(event, root, path, label, g, this.radius, this.eventMethods));
    ;

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
      .attr("fill-opacity", d => this.eventMethods.arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("d", d => this.eventMethods.arc(d.current));

    const label = g.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(nodesWithParents)
      .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", d => +this.eventMethods.labelVisible(d.current))
      .attr("transform", d => this.eventMethods.labelTransform(d.current, this.radius))
      .text(d => d.data.name)
    ;
      
    path.filter(d => d.children)
      .style("cursor", "pointer")
      .on("click", event => this.clicked(event, root, path, label, g, this.radius, this.eventMethods))
    ;

    path.append("title")
      .text(d => d.parent === root ? d.data.name : d.value )
    ;
  }

  clicked(node, root, path, label, g, radius, eventMethods) {
    root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - node.x0) / (node.x1 - node.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - node.x0) / (node.x1 - node.x0))) * 2 * Math.PI,
            y0: node === root ? Math.max(0, d.y0 - node.depth) : .66,
            y1: Math.max(0, d.y1 - node.depth)
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
          return +this.getAttribute("fill-opacity") || eventMethods.arcVisible(d.target);
      })
      .attr("fill-opacity", d => eventMethods.arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
      .attrTween("d", d => () => eventMethods.arc(d.current));

    label.filter(function (d) {
        return +this.getAttribute("fill-opacity") || eventMethods.labelVisible(d.target);
    }).transition(t)
      .attr("fill-opacity", d => +eventMethods.labelVisible(d.target))
      .attrTween("transform", d => () => eventMethods.labelTransform(d.current, radius));
  }
}

