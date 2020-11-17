class Home {
    constructor() {
        this.util = new Util();
    }

    render() {
        let text = this.getText();

        d3.select(".userPrompt")
            .selectAll("a")
            .data(text)
            .enter()
            .append("a")
            .attr("href", d => d.link)
            .text(d => d.text)
        ;
    }

    getText() {
        let text = [{text: "Take Quiz", link: "quiz.html"}];
        let answers = this.util.getLocalStorage("answers", []);

        if (answers !== null) {
            text = [
                {text: "Re-Take Quiz", link: "quiz.html"},
                {text: "Go to Data",   link: "data.html"},
            ];
        }

        return text;
    }
}

const home = new Home();

home.render();