class Util {
    constructor() {

    }

    sortInts(a, b) {
        a = parseInt(a);
        b = parseInt(b);
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        }
        return 0;
    }

    union(arrayA, arrayB) {
        arrayB.forEach(point => {
            if (arrayA.indexOf(point) === -1) {
                arrayA.push(point);
            }
        })
        return arrayA.sort();
    }

    getLocalStorage(key) {
        const val = localStorage.getItem(key);
        try {
          return JSON.parse(val);
        } catch {
          // do nothing
        }
      }

    setLocalStorage(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }

    getSupportedLanguages() {
        return [
            "English",
            "Spanish", 
            "Portuguese",
            "Italian",
            "French",
            "German",
            "Japanese",
            "Chinese",
            "Mandarin",
            "Hindi",
            "Russian",
            "Korean",
            "Arabic",
            "Persian",
            "Turkish",
            "Cantonese",
            "Thai",
            "Punjabi",
            "Tamil",
            "Swedish",
            "Norwegian",
            "Filipino",
            "Urdu",
            "Flemish",
            "Hebrew",
            "Bengali",
            "Danish"
        ];
    }

    getSupportedGenres() {
        return [
           "Action",
           "Adventure",
           "Animation",
           "Biography",
           "Comedy",
           "Crime",
           "Documentary",
           "Drama",
           "Family",
           "Fantasy",
           "Film-Noir",
           "Game-Show",
           "History",
           "Horror",
           "Music",
           "Musical",
           "Mystery",
           "News",
           "Reality-TV",
           "Romance",
           "Sci-Fi",
           "Short",
           "Sport",
           "Talk-Show",
           "Thriller",
           "War",
           "Western",
        ];
    }

    getSupportedYearMin(dataset) {
        return dataset === "movies" ? 1901 : 1902;
    }

    getSupportedYearMax() {
        return 2020;
    }

    getSupportedAgeRange() {
        return [
            "7+",
            "13+",
            "16+",
            "18+"
        ];
    }
}