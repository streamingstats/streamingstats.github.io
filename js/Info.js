class Info {
    constructor() {

    }

    render(data, services) {
        for (let service in services) {
            this.clearData(service);
            this.loadData(service, services[service]);
        }
    }

    clearData(service) {
        let parsedService = service.toLowerCase().replace(" ", "").replace("+", "");
        d3.select(`#${parsedService}List`).selectAll("*").remove();
    }

    loadData(service, data) {
        let parsedService = service.toLowerCase().replace(" ", "").replace("+", "");
        let listDiv = d3.select(`#${parsedService}List`);

        listDiv.append("h3")
            .text(service)
            .classed(`${parsedService}`, true)
        
        data.movies.forEach(title => {
            listDiv.append("p")
                .text(title)
        })
    }
}