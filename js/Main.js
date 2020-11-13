class Main {
    constructor() {
        this.dataType = "movies";
        this.chartType = "bar";
        this.yearMin = 2000;
        this.yearMax = 2000;
        this.ageRange = [];
        this.genres = [];
        this.ratingMin = 0;
        this.ratingMax = 100;
        this.data = [];

        this.charts = {
            "bar": new Bar(),
            "scatterplot": new Scatterplot(),
            "stacked": new Stacked(),
            "sunburst": new Sunburst(),
            "profiles": new Profiles(),
        }
        this.fetchData();
    }

    // Add in ability for user to select movies that are of interest to them.
    // Filter results of data to each service.


    clearData() {
        this.languages = [];
    }

    setDataType(dataType) {
        this.dataType = dataType;
        this.fetchData();
    }

    setChartType(chartType) {
        this.chartType = chartType;
        this.renderChart();
    }

    setLanguages(languages) {
        this.languages = languages;
    }

    setYearMin(yearMin) {
        this.yearMin = yearMin;
    }

    setYearMax(yearMax) {
        this.yearMax = yearMax;
    }

    setAgeRange(ageRange) {
        this.ageRange = ageRange;
    }

    setGenres(genres) {
        this.genres = genres;
    }

    setRatingMin(ratingMin) {
        this.ratingMin = ratingMin;
    }

    setRatingMax(ratingMax) {
        this.ratingMax = ratingMax;
    }

    fetchData() {
        d3.csv(`data/${this.dataType}.csv`, (row) => {
            if (+row['Year'] < this.yearMin) {
                this.yearMin = +row['Year'];
            }

            if (+row['Year'] > this.yearMax) {
                this.yearMax = +row['Year'];
            }
            
        })
        .then((data) => {
            this.data = data;
            this.renderInputs();
            this.renderChart();
        });
    }

    renderChart() {
        this.charts[this.chartType].render(this.data);
    }

    renderInputs() {
        let yearDiv = d3.select("#years");

        yearDiv.selectAll("input").remove();
        yearDiv.append("input")
        .attr("type", "number")
        .attr("id", "minYear")
        .attr("min", this.yearMin)
        .attr("max", this.yearMax)
        .attr("value", this.yearMin);

        yearDiv.append("input")
        .attr("type", "number")
        .attr("id", "maxYear")
        .attr("min", this.yearMin)
        .attr("max", this.yearMax)
        .attr("value", this.yearMax);

        console.log(this.yearMin);
        console.log(this.yearMax);

    }

    renderLanguageOptions() {

    }
}

const main = new Main();

function setDataType(dataType) {
    main.setDataType(dataType);
}

function setChartType(chartType) {
    main.setChartType(chartType);
}

function setLanguages(languages) {
    main.setLanguages(languages)
}

function setYearMin(yearMin) {
    main.setYearMin(yearMin);
}

function setYearMax(yearMax) {
    main.setYearMax(yearMax);
}

function setAgeRange(ageRange) {
    main.setAgeRange(ageRange);
}

function setGenres(genres) {
    main.setGenres(genres);
}

function setRatingMin(ratingMin) {
    main.setRatingMin(ratingMin);
}

function setRatingMax(ratingMax) {
    main.setRatingMax(ratingMax);
}
