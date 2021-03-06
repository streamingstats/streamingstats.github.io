class Main {
    constructor() {
        this.data = [];
        this.util = new Util();
        this.getSelections();

        this.charts = {
            "bar": {label: "Quantity", chart: new Bar()},
            "grouped": {label: "Ratings", chart: new Grouped()},
            "sunburst": {label: "Categories", chart: new Sunburst()},
            "profiles": {label: "Profiles", chart: new Profiles()},
        }

        this.renderDataTypes();
        this.renderChartTypes();
        this.infoChart = new Info();
        this.fetchData();
    }

    getSelections() {
        this.selections = this.util.getLocalStorage("selections");

        if (this.selections === null) {
            this.selections = {
                ageRange: this.util.getSupportedAgeRange(),
                chartType: "bar",
                dataType: "movies",
                genres: this.util.getSupportedGenres(),
                languages: this.util.getSupportedLanguages(),
                ratings: {
                    min: 0,
                    max: 100,
                },
                years: {
                    min: this.util.getSupportedYearMin("movies"),
                    max: this.util.getSupportedYearMax(),
                }
            };
            this.setSelections();
        }
    }

    setSelections() {
        this.util.setLocalStorage("selections", this.selections);
    }

    setDataType(dataType) {
        this.selections.dataType = dataType;
        this.fetchData();
    }

    setChartType(chartType) {
        this.selections.chartType = chartType;

        d3.select("#chartTypes > .selected").classed("selected", false);
        d3.select(`#nav${chartType}`).classed("selected", true);

        this.renderChart();
    }

    updateAllLanguages() {
        let button = document.getElementById("allLanguages");
        let checked = button.textContent === "Select All";
        button.textContent = checked ? "Unselect All" : "Select All";

        let languages = document.getElementsByName("languages");
        for (let language of languages) {
            language.checked = checked ? true : null;
        }

        this.selections.languages = checked ? this.util.getSupportedLanguages() : [];
        this.renderChart();
    }

    updateLanguages(language, add) {
        let index = this.selections.languages.indexOf(language);
        if (add && index === -1) {
            this.selections.languages.push(language);
        } else if (!add && index !== -1) {
            this.selections.languages.splice(index, 1);
        }
        this.renderChart();
    }

    setYearMin(yearMin) {
        yearMin = parseInt(yearMin)
        if (yearMin >= this.util.getSupportedYearMin(this.dataType) && yearMin <= this.util.getSupportedYearMax()) {
            this.selections.years.min = yearMin;
            this.renderChart();
        }
    }

    setYearMax(yearMax) {
        if (yearMax >= this.util.getSupportedYearMin(this.dataType) && yearMax <= this.util.getSupportedYearMax()) {
            this.selections.years.max = yearMax;
            this.renderChart();
        }
    }

    updateAgeRange(age, add) {
        let index = this.selections.ageRange.indexOf(age);
        if (add && index === -1) {
            this.selections.ageRange.push(age);
        } else if (!add && index !== -1) {
            this.selections.ageRange.splice(index, 1);
        }
        this.renderChart();
    }

    updateAllGenres() {
        let button = document.getElementById("allGenres");
        let checked = button.textContent === "Select All";
        button.textContent = checked ? "Unselect All" : "Select All";

        let genres = document.getElementsByName("genres");
        for (let genre of genres) {
            genre.checked = checked ? true : null;
        }

        this.selections.genres = checked ? this.util.getSupportedGenres() : [];
        this.renderChart();
    }

    updateGenres(genre, add) {
        let index = this.selections.genres.indexOf(genre);
        if (add && index === -1) {
            this.selections.genres.push(genre);
        } else if (!add && index !== -1) {
            this.selections.genres.splice(index, 1);
        }
        this.renderChart();
    }

    setRatingMin(ratingMin) {
        ratingMin = parseInt(ratingMin);
        if (ratingMin >= 0 && ratingMin <= 100) {
            this.selections.ratings.min = ratingMin;
            this.renderChart();
        }
    }

    setRatingMax(ratingMax) {
        ratingMax = parseInt(ratingMax);
        if (ratingMax >= 0 && ratingMax <= 100) {
            this.selections.ratings.max = ratingMax;
            this.renderChart();
        }
    }

    fetchData() {
        d3.csv(`data/${this.selections.dataType}.csv`)
        .then((data) => {
            this.data = data;
            this.renderInputs();
            this.renderChart();
        });
    }

    renderChart() {
        this.setSelections();
        this.clearChart();
        let selectedData = [];
        let services = {
            "Netflix": {count: 0, movies: []},
            "Hulu": {count: 0, movies: []},
            "Prime Video": {count: 0, movies: []},
            "Disney+": {count: 0, movies: []},
        };

        for (let row of this.data) {
            if (row.Year < this.selections.years.min || row.Year > this.selections.years.max) {
                continue;
            }

            let age = row.Age === "" ? "all" : row.Age;
            if (age !== "all" && this.selections.ageRange.indexOf(age) === -1) {
                continue;
            }

            let rating = row['Rotten Tomatoes'];
            if (rating < this.selections.ratings.min || rating > this.selections.ratings.max) {
                continue;
            }

            if (this.selections.dataType === "movies") {
                let languages = row.Language.split(",");

                let found = false;
                if (languages.indexOf("") !== -1 ||
                    languages.indexOf("None") !== -1) {
                    found = true;
                } else {
                    for (let language of languages) {
                        if (this.selections.languages.indexOf(language) !== -1) {
                            found = true;
                            break;
                        }
                    }
                }

                if (!found) {
                    continue;
                }

                let genres = row.Genres.split(",");
                found = false;

                if (genres.indexOf("") !== -1 ||
                    genres.indexOf("None") !== -1) {
                    found = true;
                } else {
                    for (let genre of genres) {
                        if (this.selections.genres.indexOf(genre) !== -1) {
                            found = true;
                            break;
                        }
                    }
                }

                if (!found) {
                    continue;
                }
            }

            for (let service in services) {
                let add = parseInt(row[service])
                services[service].count += add;
                if (add === 1) {
                    services[service].movies.push(row.Title);
                }
            }
            selectedData.push(row);
        }

        this.charts[this.selections.chartType].chart.render(selectedData, services, this.selections);
        this.infoChart.render(selectedData, services, this.selections.genres);
    }

    clearChart() {
        d3.select("#chart").selectAll("*").remove();
    }

    renderInputs() {
        this.renderYears();
        this.renderRatings();
        this.renderAges();
        this.renderLanguages();
        this.renderGenres();
    }

    renderDataTypes() {
        let dataTypes = {
            "movies": "Movies",
            "tv_shows": "TV Shows"
        }
        let dataTypeDiv = d3.select("#dataTypes");
        dataTypeDiv.selectAll("*").remove();
        
        for (let dataType in dataTypes) {
            let div = dataTypeDiv.append("div");

            div.append("input")
                .attr("id", dataType)
                .attr("type", "radio")
                .attr("name", "dataType")
                .attr("value", dataType)
                .attr("checked", this.selections.dataType === dataType ? true : null)
                .attr("onclick", "setDataType(this.value)")
            ;

            div.append("label")
                .attr("for", dataType)
                .text(dataTypes[dataType])
            ;
        }
    }

    renderChartTypes() {
        let chartTypesDiv = d3.select("#chartTypes")
        ;

        for (let chart in this.charts) {
            chartTypesDiv.append("strong")
                .classed("navElement", true)
                .classed("selected", this.selections.chartType === chart)
                .attr("id", `nav${chart}`)
                .text(this.charts[chart].label)
                .attr("onclick", `setChartType('${chart}')`)
            ;
        }
    }

    renderYears() {
        let supportedMin = this.util.getSupportedYearMin(this.selections.dataType);
        let supportedMax = this.util.getSupportedYearMax();

        let yearDiv = d3.select("#years");
        yearDiv.selectAll("input").remove();
        yearDiv.append("input")
        .attr("type", "number")
        .attr("id", "minYear")
        .attr("min", supportedMin)
        .attr("max", supportedMax)
        .attr("value", this.selections.years.min)
        .attr("onchange", "setYearMin(this.value)");

        yearDiv.append("input")
        .attr("type", "number")
        .attr("id", "maxYear")
        .attr("min", supportedMin)
        .attr("max", supportedMax)
        .attr("value", this.selections.years.max)
        .attr("onchange", "setYearMax(this.value)");
    }

    renderRatings() {
        let supportedMin = 0;
        let supportedMax = 100;

        let yearDiv = d3.select("#ratings");
        yearDiv.selectAll("input").remove();
        yearDiv.append("input")
        .attr("type", "number")
        .attr("id", "minRating")
        .attr("min", supportedMin)
        .attr("max", supportedMax)
        .attr("value", this.selections.ratings.min)
        .attr("onchange", "setRatingMin(this.value)");

        yearDiv.append("input")
        .attr("type", "number")
        .attr("id", "maxRating")
        .attr("min", supportedMin)
        .attr("max", supportedMax)
        .attr("value", this.selections.ratings.max)
        .attr("onchange", "setRatingMax(this.value)");
    }

    renderAges() {
        let ageDiv = d3.select("#ages")
        ageDiv.selectAll("*").remove();

        this.util.getSupportedAgeRange().forEach(age => {
            let div = ageDiv.append("div");

            div.append("input")
                .attr("id", age)
                .attr("type", "checkbox")
                .attr("name", "ages")
                .attr("value", age)
                .attr("checked", this.selections.ageRange.indexOf(age) !== -1 ? true : null)
                .attr("onclick", "updateAgeRange(this.value, this.checked)")
            ;

            div.append("label")
                .attr("for", age)
                .text(age)
            ;
        });
    }

    renderGenres() {
        let sidenav = d3.select(".sidenav");

        if (this.selections.dataType === "movies") {
            let genreDiv = sidenav.append("div")
            .attr("id", "genres");

            genreDiv.append("h3")
            .text("Genres")

            let selectAllDiv = genreDiv.append("div")
                .attr("style", "text-align:center");
            
            selectAllDiv.append("button")
                .attr("id", "allGenres")
                .attr("onclick", "updateAllGenres()")
                .text(this.selections.genres.length === this.util.getSupportedGenres().length ? "UnSelect All" : "Select All")
            ;

            this.util.getSupportedGenres().forEach(genre => {
                let div = genreDiv.append("div");
    
                div.append("input")
                    .attr("id", genre)
                    .attr("type", "checkbox")
                    .attr("name", "genres")
                    .attr("value", genre)
                    .attr("checked", this.selections.genres.indexOf(genre) !== -1 ? true : null)
                    .attr("onclick", "updateGenres(this.value, this.checked)")
                ;
    
                div.append("label")
                    .attr("for", genre)
                    .text(genre)
                ;
            });

        } else {
            sidenav.select("#genres").remove();
        }
    }

    renderLanguages() {
        let sidenav = d3.select(".sidenav");

        if (this.selections.dataType === "movies") {
            let languageDiv = sidenav.append("div")
            .attr("id", "languages");

            languageDiv.append("h3")
            .text("Languages")
            
            let selectAllDiv = languageDiv.append("div")
                .attr("style", "text-align:center");
            
            selectAllDiv.append("button")
                .attr("id", "allLanguages")
                .attr("onclick", "updateAllLanguages()")
                .text(this.selections.languages.length === this.util.getSupportedLanguages().length ? "UnSelect All" : "Select All")
            ;

            this.util.getSupportedLanguages().forEach(language => {
                let div = languageDiv.append("div");
    
                div.append("input")
                    .attr("id", language)
                    .attr("type", "checkbox")
                    .attr("name", "languages")
                    .attr("value", language)
                    .attr("checked", this.selections.languages.indexOf(language) !== -1 ? true : null)
                    .attr("onclick", "updateLanguages(this.value, this.checked)")
                ;
    
                div.append("label")
                    .attr("for", language)
                    .text(language)
                ;
            });

        } else {
            sidenav.select("#languages").remove();
        }
    }
}

const main = new Main();

function update() {
    main.renderChart();
}

function setDataType(dataType) {
    main.setDataType(dataType);
}

function setChartType(chartType) {
    main.setChartType(chartType);
}

function updateAllLanguages() {
    main.updateAllLanguages();
}

function updateLanguages(language, checked) {
    main.updateLanguages(language, checked)
}

function setYearMin(yearMin) {
    main.setYearMin(yearMin);
}

function setYearMax(yearMax) {
    main.setYearMax(yearMax);
}

function updateAgeRange(age, checked) {
    main.updateAgeRange(age, checked);
}

function updateAllGenres() {
    main.updateAllGenres();
}

function updateGenres(genre, checked) {
    main.updateGenres(genre, checked);
}

function setRatingMin(ratingMin) {
    main.setRatingMin(ratingMin);
}

function setRatingMax(ratingMax) {
    main.setRatingMax(ratingMax);
}
