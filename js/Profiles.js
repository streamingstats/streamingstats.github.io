class Profiles {
    constructor() {
        this.data = [];
        d3.csv(`data/profile_cost.csv`, d => {
         this.data.append({"service":d.service,"price":+d.price, "profile_count":+d.profile_count, "screen_count":+d.screen_count})
        })
    }

    render(data, count) {
        console.log(this.data);
    }
}