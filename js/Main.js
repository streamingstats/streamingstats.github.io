class Main {
    constructor() {
        this.dataType = "movies";
        this.chartType = "bar";
        this.languages = [];
        this.yearMin = 1935;
        this.yearMax = 2020;
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
            "profiles": new Profiles()
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
