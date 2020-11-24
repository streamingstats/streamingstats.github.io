class Sunburst {
    constructor() {
      this.burst = [
          {name:"Netflix", children:[] },
          {name:"Amazon Prime", children:[]},
          {name:"Hulu", children:[]},
          {name:"Disney", children:[]}
      ];
      this.util = new Util();
    }

    render(data, counts, genres) {
        for ( let i = 0; i < genres.length; i++)
        {
            this.burst[0]['children'].push({genre:genres[i], count:0});
            this.burst[1]['children'].push({genre:genres[i], count:0});
            this.burst[2]['children'].push({genre:genres[i], count:0});
            this.burst[3]['children'].push({genre:genres[i], count:0});
        }

        for (let i = 0; i < data.length; i++)
        {
            let category = data[i]['Genres']
            let genreArray = category.split(",");
            let emptyIndex = genreArray.indexOf("")
            if (emptyIndex !== -1) {
                genreArray.splice(emptyIndex, 1);
            }

            for (let j = 0; j < genreArray.length; j++)
            {
                for (let k = 0; k < genres.length; k++)
                {
                    if (genres[k] == genreArray[j])
                    {
                      if (data[i]['Netflix'] == "1")
                      {
                        this.burst[0]['children'][k]['count'] += 1;
                      }
                      if (data[i]['Disney+'] == "1")
                      {
                        this.burst[1]['children'][k]['count'] += 1;
                      }
                      if (data[i]['Hulu'] == "1")
                      {
                        this.burst[2]['children'][k]['count'] += 1;
                      }
                      if (data[i]['Prime Video'] == "1")
                      {
                        this.burst[3]['children'][k]['count'] += 1;
                      }
                    }
                }
            }
        }
        console.log(this.burst)
    }
}