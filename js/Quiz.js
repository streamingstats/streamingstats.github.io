class Quiz {
    constructor() {
        this.util = new Util();
        this.dataType = "movies";
        this.genres = [];
        this.ageRange = [];
        this.ratingMin = 0;
        this.ratingMax = 100;
        this.yearMin = this.util.getSupportedYearMin(this.dataType);
        this.yearMax = this.util.getSupportedYearMax();
        this.languages = [];
    }

    render() {
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
        quizDiv.append("div")
            .classed("submit", true)
            .append("button")
            .text("Submit")
            .attr("onclick", "submit()")
        ;
    }

    setDataType(dataType) {
        this.dataType = dataType;
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
        if (yearMin >= this.util.getSupportedYearMin(this.dataType) && yearMin <= this.util.getSupportedYearMax()) {
            this.yearMin = yearMin;
        }
    }

    setYearMax(yearMax) {
        if (yearMax >= this.util.getSupportedYearMin(this.dataType) && yearMax <= this.util.getSupportedYearMax()) {
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
        let supportedMin = this.util.getSupportedYearMin(this.dataType);
        let supportedMax = this.util.getSupportedYearMax();

        let yearDiv = quizDiv
            .append("div")
            .attr("id", "years")
        ;

        yearDiv
            .append("h3")
            .text("How new/old do you like your media? Pick an age range.")
        ;

        yearDiv.append("label")
            .attr("for", "minYear")
            .text("Min Year: ")
        ;

        yearDiv.append("input")
            .attr("type", "number")
            .attr("id", "minYear")
            .attr("min", supportedMin)
            .attr("max", supportedMax)
            .attr("value", supportedMin)
            .attr("onchange", "setYearMin(this.value)")
        ;

        yearDiv.append("label")
            .attr("for", "maxYear")
            .text("Max Year: ")
        ;

        yearDiv.append("input")
            .attr("type", "number")
            .attr("id", "maxYear")
            .attr("min", supportedMin)
            .attr("max", supportedMax)
            .attr("value", supportedMax)
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

        ratingDiv.append("label")
            .attr("for", "minRating")
            .text("Min Rating: ")
        ;

        ratingDiv.append("input")
            .attr("type", "number")
            .attr("id", "minRating")
            .attr("min", 0)
            .attr("max", 100)
            .attr("value", 0)
            .attr("onchange", "setRatingMin(this.value)")
        ;

        ratingDiv.append("label")
            .attr("for", "maxRating")
            .text("Max Rating: ")
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

    renderAges(quizDiv) {
        let ageDiv = quizDiv
            .append("div")
            .attr("id", "ageRange")
        ;

        ageDiv
            .append("h3")
            .html("What Age categories of Media would you permit in your home?")
        ;

        this.util.getSupportedAgeRange().forEach(age => {
            let div = ageDiv.append("div");

            div.append("input")
                .attr("id", age)
                .attr("type", "checkbox")
                .attr("name", "ages")
                .attr("value", age)
                .attr("onclick", "updateAgeRange(this.value, this.checked)")
            ;

            div.append("label")
                .attr("for", age)
                .text(age)
            ;
        });
    }

    renderGenres(quizDiv) {
        let genreDiv = quizDiv.append("div")
            .attr("id", "genres");

        genreDiv.append("h3")
            .text("What Genre of media do you regularly watch?")
        
        this.util.getSupportedGenres().forEach(genre => {
            let div = genreDiv.append("div");

            div.append("input")
                .attr("id", genre)
                .attr("type", "checkbox")
                .attr("name", "genres")
                .attr("value", genre)
                .attr("onclick", "updateGenres(this.value, this.checked)")
            ;

            div.append("label")
                .attr("for", genre)
                .text(genre)
            ;
        });
    }

    renderLanguages(quizDiv) {
        let languageDiv = quizDiv.append("div")
            .attr("id", "languages");

        languageDiv.append("h3")
            .text("What Languages do you regularly watch your media in?")

        this.util.getSupportedLanguages().forEach(language => {
            let div = languageDiv.append("div");

            div.append("input")
                .attr("id", language)
                .attr("type", "checkbox")
                .attr("name", "languages")
                .attr("value", language)
                .attr("onclick", "updateLanguages(this.value, this.checked)")
            ;

            div.append("label")
                .attr("for", language)
                .text(language)
            ;
        });
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

    submit() {
        let data = {
            dataType: this.dataType,
            chartType: "bar",
            ageRange: this.ageRange,
            years: {
                min: this.yearMin,
                max: this.yearMax
            },
            ratings: {
                min: this.ratingMin,
                max: this.ratingMax
            },
            languages: this.languages,
            genres: this.genres 
        }
        this.util.setLocalStorage("selections", data)
        window.location.href = "./data.html";
    }
}

const quiz = new Quiz();

function submit() {
    quiz.submit();
}

function setDataType(dataType) {
    quiz.setDataType(dataType);
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