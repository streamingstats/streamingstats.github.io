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
}