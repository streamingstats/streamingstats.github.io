class Main {
    constructor() {
        this.dataType = "movies";
        this.chartType = "bar";
        this.data = [];

        this.charts = {
            "bar": new Bar(),
            "scatterplot": new Scatterplot(),
            "stacked": new Stacked(),
            "sunburst": new Sunburst(),
        }
        this.fetchData();
    }

    setDataType(dataType) {
        this.dataType = dataType;
        this.fetchData();
    }

    setChartType(chartType) {
        this.chartType = chartType;
        this.render();
    }

    fetchData() {
        d3.csv(`data/${this.dataType}.csv`)
        .then((data) => {
            this.data = data;
            this.render();
        });
    }

    render() {
        this.charts[this.chartType].render(this.data);
    }
}

const main = new Main();

function setDataType(dataType) {
    main.setDataType(dataType);
}

function setChartType(chartType) {
    main.setChartType(chartType);
}