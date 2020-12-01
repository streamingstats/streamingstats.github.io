class Info {
    constructor() {

    }

    render(data, services) {
        for (let service in services) {
            this.clearData(this.service);
            this.loadData(service, services[service]);
        }
    }

    clearData(service) {
        d3.select(`#${service}List`).selectAll("*").remove();
    }

    loadData(service, data) {
        let parsedService = service.toLowerCase().replace(" ", "").replace("+", "");
        let listDiv = d3.select(`#${parsedService}List`);
        
        data.movies.forEach(title => {
            listDiv.append("p")
                .text(title)
        })
    }
}