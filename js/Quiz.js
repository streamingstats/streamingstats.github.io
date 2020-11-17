class Quiz {
    constructor() {
        this.dataType = "movies";
        this.genres = [];
        this.ageRange = [
            "7+",
            "13+",
            "16+",
            "18+"
        ];
        this.ratingMin = 0;
        this.ratingMax = 100;
        this.dataYearMin = 1901;
        this.dataYearMax = 2020;
        this.yearMin = this.dataYearMin;
        this.dataYearMax = this.dataYearMax;
        this.util = new Util();
        this.languages = this.util.getSupportedLanguages();

        d3.csv(`data/movies.csv`, (row) => {
            let genre = row['Genres']
            let genreArray = genre.split(",");
            let emptyIndex = genreArray.indexOf("")
            if (emptyIndex !== -1) {
                genreArray.splice(emptyIndex, 1);
            }
            this.genres = this.util.union(this.genres, genreArray);
        });
    }

    render() {
        console.log(this.dataType);

        let quizDiv = d3.select('.quiz');

        this.clearForm(quizDiv);
        this.setPageNumber(2, 2);
        this.renderYears(quizDiv);
        this.renderAges(quizDiv);
        this.renderRating(quizDiv);

        if (this.dataType === "movies") {
            this.renderLanguages(quizDiv);
            this.renderGenres(quizDiv);
        }
    }

    setDataType(dataType) {
        console.log(dataType);
        this.dataType = dataType;
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
        console.log(yearMin);
        if (yearMin >= this.dataYearMin && yearMin <= this.dataYearMax) {
            this.yearMin = yearMin;
        }
    }

    setYearMax(yearMax) {
        console.log(yearMax);
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

    renderYears(quizDiv) {
        let yearDiv = quizDiv
            .append("div")
            .attr("id", "years")
        ;

        yearDiv
            .append("h3")
            .text("How new/old do you like your media? Pick an age range.")
        ;

        yearDiv.append("input")
            .attr("type", "number")
            .attr("id", "minYear")
            .attr("min", this.dataYearMin)
            .attr("max", this.dataYearMax)
            .attr("value", this.dataYearMin)
            .attr("onchange", "setYearMin(this.value)")
        ;

        yearDiv.append("input")
            .attr("type", "number")
            .attr("id", "maxYear")
            .attr("min", this.dataYearMin)
            .attr("max", this.dataYearMax)
            .attr("value", this.dataYearMax)
            .attr("onchange", "setYearMax(this.value)")
        ;
    }

    renderRating(quizDiv) {
        let ratingDiv = quizDiv
            .append("div")
            .attr("id", "rating")
        ;

        ratingDiv
            .append("h3")
            .html("What level of <strong>Rotten Tomatoes</strong> Rating would you sit and watch?")
        ;

        ratingDiv.append("input")
            .attr("type", "number")
            .attr("id", "minRating")
            .attr("min", 0)
            .attr("max", 100)
            .attr("value", 0)
            .attr("onchange", "setRatingMin(this.value)")
        ;

        ratingDiv.append("input")
            .attr("type", "number")
            .attr("id", "maxRating")
            .attr("min", 0)
            .attr("max", 100)
            .attr("value", 100)
            .attr("onchange", "setRatingMax(this.value)")
        ;
    }

    renderAges() {
        let ageDiv = quizDiv
            .append("div")
            .attr("id", "ageRange")
        ;

        ageDiv
            .append("h3")
            .html("What Age categories of Media would you permit in your home?")
        ;

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

    clearForm(quizDiv) {
        quizDiv
            .selectAll("*")
            .remove()
        ;
    }

    setPageNumber(pageNumber, maxNumber) {
        d3.select(".page")
            .text(`questions ${pageNumber}/${maxNumber}`)
        ;            
    }

    submit(form) {
        console.log(form);
    }
}

const quiz = new Quiz();

function submit(form) {
    quiz.submit(form);
}

function setDataType(dataType) {
    quiz.setDataType(dataType);
}

function setChartType(chartType) {
    quiz.setChartType(chartType);
}

function updateLanguages(language, checked) {
    quiz.updateLanguages(language, checked)
}

function setYearMin(yearMin) {
    quiz.setYearMin(yearMin);
}

function setYearMax(yearMax) {
    quiz.setYearMax(yearMax);
}

function updateAgeRange(age, checked) {
    quiz.updateAgeRange(age, checked);
}

function updateGenres(genre, checked) {
    quiz.updateGenres(genre, checked);
}

function setRatingMin(ratingMin) {
    quiz.setRatingMin(ratingMin);
}

function setRatingMax(ratingMax) {
    quiz.setRatingMax(ratingMax);
}

function render() {
    quiz.render();
}