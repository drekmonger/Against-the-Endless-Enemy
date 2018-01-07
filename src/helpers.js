//helper functions

export let TOP = 95
export let LEFT = 140
export let cT = (n) => n * 50 - 50  //convert Tiles to pixels

export let campSanity = (camp, cost = true) => {
    return ((camp.supplies > 0 || cost == false) && camp.phase <= 3 && !camp.pickGuild) 
}

export let isRare = () => Math.random() > .8

export let distance = (pA, pB) => Math.hypot(pB.tX - pA.tX, pB.tY - pA.tY) //distance between two pawns

export let lineSight = (a, b, grid) => {  //returns 100 if a wall is found between two Tiles, a-Start and b-End
    //http://rosettacode.org/wiki/Bitmap/Bresenham%27s_line_algorithm#JavaScript

    let dx = Math.abs(b.tX - a.tX), sx = a.tX < b.tX ? 1 : -1
    let dy = Math.abs(b.tY - a.tY), sy = a.tY < b.tY ? 1 : -1;
    let err = (dx > dy ? dx : -dy) / 2;
    let wall = false
    let acc = { tX: a.tX, tY: a.tY }
    while (true) {
        if (grid[acc.tY][acc.tX].wall) { wall = true; break }
        if (acc.tX === b.tX && acc.tY === b.tY) break;
        let e2 = err;
        if (e2 > -dx) { err -= dy; acc.tX += sx; }
        if (e2 < dy) { err += dx; acc.tY += sy; }
    }

    if (wall) { return 100 }
    return distance(a, b)
}

export function rgb(r, g, b) {
    return ["rgb(", r, ",", g, ",", b, ")"].join("");
}

//shuffle array in place
export function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}