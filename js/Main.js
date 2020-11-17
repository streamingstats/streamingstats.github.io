class Main {
    constructor() {
        this.dataType = "movies";
        this.chartType = "bar";
        this.util = new Util();

        this.charts = {
            "bar": new Bar(),
            "scatterplot": new Scatterplot(),
            "stacked": new Stacked(),
            "sunburst": new Sunburst(),
            "profiles": new Profiles(),
            "info": new Info(),
        }
        this.fetchData();
    }

    // Add in ability for user to select movies that are of interest to them.
    // Filter results of data to each service.

    clearData() {
        this.ageRange = [];
        this.genres = [];
        this.ratingMin = 0;
        this.ratingMax = 100;
        this.data = [];
        this.languages = this.util.getSupportedLanguages();
        this.dataYearMin = 2000;
        this.dataYearMax = 2000;
    }

    setDataType(dataType) {
        this.dataType = dataType;
        this.fetchData();
    }

    setChartType(chartType) {
        this.chartType = chartType;
        this.renderChart();
    }

    updateLanguages(language, add) {
        let index = this.languages.indexOf(language);
        if (add && index === -1) {
            this.languages.push(language);
        } else if (!add && index !== -1) {
            this.languages.splice(index, 1);
        }
    }

    setYearMin(yearMin) {
        if (yearMin >= this.dataYearMin && yearMin <= this.dataYearMax) {
            this.yearMin = yearMin;
        }
    }

    setYearMax(yearMax) {
        if (yearMax >= this.dataYearMin && yearMax <= this.dataYearMax) {
            this.yearMax = yearMax;
        }
    }

    updateAgeRange(age, add) {
        let index = this.ageRange.indexOf(age);
        if (add && index === -1) {
            this.ageRange.push(age);
        } else if (!add && index !== -1) {
            this.ageRange.splice(index, 1);
        }
    }

    updateGenres(genre, add) {
        let index = this.genres.indexOf(genre);
        if (add && index === -1) {
            this.genres.push(genre);
        } else if (!add && index !== -1) {
            this.genres.splice(index, 1);
        }
    }

    setRatingMin(ratingMin) {
        if (ratingMin >= 0 && ratingMin <= 100) {
            this.ratingMin = ratingMin;
        }
    }

    setRatingMax(ratingMax) {
        if (ratingMax >= 0 && ratingMax <= 100) {
            this.ratingMax = ratingMax;
        }
    }

    fetchData() {
        this.clearData();
        d3.csv(`data/${this.dataType}.csv`, (row) => {
            let year = +row['Year'];
            if (year < this.dataYearMin) {
                this.dataYearMin = year;
            }

            if (year > this.dataYearMax) {
                this.dataYearMax = year;
            }

            let age = row['Age'];
            if (age !== "" && 
                age !== "all" && 
                this.ageRange.indexOf(age) === -1) {
                this.ageRange.push(age);
            }
            this.ageRange.sort(this.util.sortInts);

            if (this.dataType === "movies") {
                let genre = row['Genres']
                let genreArray = genre.split(",");
                let emptyIndex = genreArray.indexOf("")
                if (emptyIndex !== -1) {
                    genreArray.splice(emptyIndex, 1);
                }
                this.genres = this.util.union(this.genres, genreArray);
            }
            return row;
        })
        .then((data) => {
            this.data = data;
            this.renderInputs();
            this.renderChart();
        });
    }

    renderChart() {
        this.clearChart();
        let localData = [];
        let count = {
            "Netflix": 0,
            "Hulu": 0,
            "Prime Video": 0,
            "Disney+": 0,
        };

        for (let row of this.data) {
            if (row.Year < this.yearMin || row.Year > this.yearMax) {
                continue;
            }

            let age = row.Age === "" ? "all" : row.Age;
            if (age !== "all" && this.ageRange.indexOf(age) === -1) {
                continue;
            }

            let rating = row['Rotten Tomatoes'];
            if (rating < this.ratingMin || rating > this.ratingMax) {
                continue;
            }

            if (this.dataType === "movies") {
                let languages = row.Language.split(",");

                let found = false;
                if (languages.indexOf("") !== -1 ||
                    languages.indexOf("None") !== -1) {
                    found = true;
                }
                else {
                    for (let language of languages) {
                        if (this.languages.indexOf(language) !== -1) {
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
                        if (this.genres.indexOf(genre) !== -1) {
                            found = true;
                            break;
                        }
                    }
                }

                if (!found) {
                    continue;
                }
            }

            for (let service in count) {
                count[service] += parseInt(row[service]);
            }
            localData.push(row);
        }

        this.charts[this.chartType].render(localData, count);
        this.charts.info.render(localData, count);
    }

    clearChart() {
        d3.select("#chart").selectAll("*").remove();
    }

    renderInputs() {
        this.renderYears();
        this.renderAges();
        this.renderLanguages();
        this.renderGenres();
    }

    renderYears() {
        this.yearMin = this.dataYearMin;
        this.yearMax = this.dataYearMax;

        let yearDiv = d3.select("#years");
        yearDiv.selectAll("input").remove();
        yearDiv.append("input")
        .attr("type", "number")
        .attr("id", "minYear")
        .attr("min", this.dataYearMin)
        .attr("max", this.dataYearMax)
        .attr("value", this.dataYearMin)
        .attr("onchange", "setYearMin(this.value)");

        yearDiv.append("input")
        .attr("type", "number")
        .attr("id", "maxYear")
        .attr("min", this.dataYearMin)
        .attr("max", this.dataYearMax)
        .attr("value", this.dataYearMax)
        .attr("onchange", "setYearMax(this.value)");
    }

    renderAges() {
        let ageDiv = d3.select("#ages")

        ageDiv.selectAll("*").remove();

        this.ageRange.forEach(age => {
            let div = ageDiv.append("div");

            div.append("input")
                .attr("id", age)
                .attr("type", "checkbox")
                .attr("name", "ages")
                .attr("value", age)
                .attr("checked", true)
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

        if (this.dataType === "movies") {
            let genreDiv = sidenav.append("div")
            .attr("id", "genres");

            genreDiv.append("h3")
            .text("Genres")
            
            this.genres.forEach(genre => {
                let div = genreDiv.append("div");
    
                div.append("input")
                    .attr("id", genre)
                    .attr("type", "checkbox")
                    .attr("name", "genres")
                    .attr("value", genre)
                    .attr("checked", true)
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

        if (this.dataType === "movies") {
            let languageDiv = sidenav.append("div")
            .attr("id", "languages");

            languageDiv.append("h3")
            .text("Languages")

            this.languages.forEach(language => {
                let div = languageDiv.append("div");
    
                div.append("input")
                    .attr("id", language)
                    .attr("type", "checkbox")
                    .attr("name", "languages")
                    .attr("value", language)
                    .attr("checked", true)
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

function updateGenres(genre, checked) {
    main.updateGenres(genre, checked);
}

function setRatingMin(ratingMin) {
    main.setRatingMin(ratingMin);
}

function setRatingMax(ratingMax) {
    main.setRatingMax(ratingMax);
}
