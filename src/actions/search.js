export function search(grid, start, distanceLimit = 100, ignorePawns=false) {

    let frontier = []
    frontier.push(start)

    //clean the grid
    for (let y = 0; y < 14; y++) {
        for (let x = 0; x < 22; x++) {
            grid[y][x].distance = null
            grid[y][x].came_from = null
        }
    }

    grid[start.y][start.x].distance = 0

    while (frontier.length > 0) {
        let current = frontier.shift()
        if (grid[current.y][current.x].distance < distanceLimit) {
            //find neigbors to current
            let neig = []
            
            //north
            neig.push({ x: current.x, y: current.y-1 })

            //east
            neig.push({ x: current.x+1, y: current.y })

            //south
            neig.push({ x: current.x, y: current.y+1 })

            //west
            neig.push({ x: current.x-1, y: current.y })

            //search each neighbor
            for (let n of neig) {
                if (n.y >= 0 && n.x >= 0 && n.y < 14 && n.x < 22) {
                    let nC = grid[n.y][n.x]
                    if (nC.distance === null && !nC.wall && (!nC.occupied || (nC.occupied.isPlayer && ignorePawns)) ) {
                        frontier.push(n)
                        nC.distance = 1 + grid[current.y][current.x].distance
                        nC.came_from = current
                    }
                }
            }
        }
    }
    return { grid }
}


export function walkTo(start, end, grid) {
    //requires grid be primed for start by the search function
    let path = []
    let current = end

    while (!(current == null)) {
        path.unshift(current)
        current = grid[current.y][current.x].came_from
    }
    return path.length > 1 ? path : null
}








