//helper functions
import { search, walkTo } from './search'
import { tween, Tweezer } from "./tweezer"
import { campSanity, isRare, cT, distance, lineSight, rgb, shuffle } from "../helpers"


export default {
    //****APPLICATION************************************************************

    gameInit: (state, actions, event) => {

        actions.gameInitialState()
        actions.pawnCreate(0)
        actions.pawnCreate(1)
        actions.pawnCreate(2)
        actions.mapInit()
        console.log(state)

    },

    gameInitialState: (state) => {
        let camp = state.camp
        camp.supplies = 4
        camp.train = 0
        
        return ({
            camp,
            day: 0,
            pawns: [],
            enemies: []
        })
    },

    gameOver: (state, actions) => {

        return {
            gameStatus: 3
        }
    },

    //****TURN****************************************************************

    turnBegin: (state, actions) => {
        actions.turnSpawnEnemies()
        actions.turnInitialState()
        actions.turnNextPawn()
    },

    turnSpawnEnemies: (state, actions) => {
        let grid = state.grid
        let m = state.monsters
        let p = state.monsterPoints

        let spawnLocs = []
        for (let i = 1; i < 12; i++) {
            if (!grid[i][21].occupied) {
                spawnLocs.push(i)
            }
        }

        if (spawnLocs.length > 0) {
            shuffle(spawnLocs)

            let t = Math.floor(Math.random() * (4))

            for (let i = 0; i <= t; i++) {
                if (p > 0) {
                    let gID = Math.floor(Math.random() * (4))

                    if (m[gID].cost > p || (state.day < 3 && gID == 3)) {
                        gID = 0
                    }
                    p = p - m[gID].cost
                    actions.monsterCreate({ gID, tX: 21, tY: spawnLocs.pop() })
                    if (spawnLocs.length == 0 || p == 0) { break }
                }
            }
        }

        return ({
            monsterPoints: p,
            enemies: [...state.enemies]
        })
    },

    turnInitialState: (state) => {
        return ({
            turnPhase: 0,
            currentPawn: null,
            initiative: [...state.enemies, ...state.pawns]
        })
    },

    turnNextPawn: (state, actions) => {
        if (state.initiative.length == 0) {
            actions.turnBegin()
        } else {
            let currentPawn = state.initiative.shift()
            if (currentPawn.isPlayer) {
                actions.turnPhaseMove(currentPawn)
            } else {
                actions.turnEnemy(currentPawn)
            }
        }
    },

    turnPhaseMove: (state, actions, pawn) => {
        let grid = [...state.grid]
        let start = { x: pawn.tX, y: pawn.tY }
        search(grid, start, pawn.move, true)
        return ({
            turnPhase: 1,
            currentPawn: pawn,
            grid
        })

    },

    turnPhaseAction: (state, actions) => {
        let actList = []
        let p = state.currentPawn
        let enemies = state.enemies
        //a-action d-description t-target   d-description

        for (let e of enemies) {

            let dist = lineSight(p, e, state.grid)

            if (dist == 1) {
                actList.push({ a: actions.pawnMelee, d: "attack", t: e })
            } else if (dist <= p.special.range && !p.isExhaust) {
                actList.push({ a: actions.pawnSpecial, d: p.special.desc, t: e })
            }

        }

        if (actList.length == 0) {
            actions.pawnDoNothing()
            return null
        }

        actList.push({ a: actions.pawnDoNothing, d: "rest", t: p }, )

        return ({
            turnPhase: 3,
            actList
        })
    },

    turnEnemy: (state, actions, pawn) => {
        actions.turnEnemyInit(pawn)
        let dR = pawn.range //desired range of monster
        let targets = state.pawns
        let grid = state.grid

        //goto actions if there's a player in range

        let viable = []

        if (pawn.range == 1 && pawn.tX != 21) {
            for (let t of targets) {
                if (distance(t, pawn) <= 1) {
                    viable.push(t)
                }
            }


            if (viable.length > 0) {
                actions.turnEnemyAction(pawn)
                return null
            }
        }

        //for each player, compile a list of locations the monster wants to be 
        viable = []

        for (let t of targets) {
            search(grid, { x: t.tX, y: t.tY })
            for (let row of grid) {
                for (let tile of row) {
                    if (tile.distance && tile.distance == dR) { viable.push(tile) }
                }
            }
        }

        //if no viable, goto to action
        if (viable.length == 0) {
            actions.turnEnemyAction(pawn)
            return null
        }

        //for each viable location, walkTo it. Find the shortest path.
        viable = viable.map(v => ({ x: v.id.x, y: v.id.y }))

        let start = { x: pawn.tX, y: pawn.tY }
        search(grid, start)

        for (let v of viable) {
            v.d = (grid[v.y][v.x].distance) ? (grid[v.y][v.x].distance) : 100
        }


        viable.sort((a, b) => a.d - b.d)
        //if no path found, goto actions. otherwise, move the monster
        if (viable[0].d == 100) {
            actions.turnEnemyAction(pawn)
        } else {
            let dest = walkTo({ x: pawn.tX, y: pawn.tY }, viable[0], grid).slice(0, pawn.move + 1).slice(-1)[0]
            actions.pawnMove(dest)
        }
    },

    turnEnemyInit: (state, actions, pawn) => {
        return ({
            turnPhase: 5,
            currentPawn: pawn,
        })
    },

    turnEnemyAction: (state, actions, p) => {

        let targets = state.pawns

        let viable = []
        for (let t of targets) {
            if (distance(t, p) <= p.range) {
                viable.push(t)
            }
        }

        if (viable.length > 0) {
            if (viable.length > 1) {
                shuffle(viable)
            }
            let r = 0
            if (p.range > 1) { r = 1 }
            actions.pawnDoAttack({ t: viable[0], a: p.attack, r, c: "Red" })
            return null
        }

        actions.turnDone()
    },

    turnDone: (state, actions) => {

        if (state.enemies.length == 0 && state.monsterPoints == 0) {
            //VICTORY
            return ({
                gameStatus: 3,
                turnPhase: 10
            })

        }

        if (state.pawns == 0) {
            //DEFEAT
            return ({
                gameStatus: 4,
                turnPhase: 10
            })
        }

        actions.turnNextPawn()
    },

    //****MAP******************************************************************

    mapInit: (state, actions) => {
        actions.mapInitialState()
        actions.turnBegin()
    },

    mapInitialState: (state) => {
        //make the grid out of a map
        let maps = [...state.maps]
        shuffle(maps)
        let map = maps[0]

        let grid$ = ""

        for (let n of map) {
            grid$ += n.toString(2)
        }

        map = []

        for (let y = 0; y < 14; y++) {
            let r = []
            for (let x = 0; x < 22; x++) {
                let i = y * 22 + x
                r.push(+grid$.slice(i, i + 1))
            }
            map.push(r)
        }

        let grid = []
        let row = []

        for (let y = 0; y < 14; y++) {
            row = []
            for (let x = 0; x < 22; x++) {
                let shade = Math.round(Math.random() * 13) - (6 * map[y][x])
                let grass = "rgb(" + (177 + shade) + ", " + " "
                let item = { wall: map[y][x], grass: rgb(177 + shade, 182 + shade, 149 + shade), tkeys: x + y * 22, occupied: false, id: { x, y } }
                row.push(item)
            }
            grid.push(row)
        }

        //set player's pawns to spawn points
        let pawns = []
        let enemies = []
        let spawns = [...state.playerSpawn]
        shuffle(spawns)

        let i = 0
        for (let p of state.pawns) {
            let loc = spawns[i]
            p.tX = loc.x
            p.tY = loc.y
            p.x = cT(p.tX)
            p.y = cT(p.tY)
            grid[loc.y][loc.x].occupied = p
            pawns.push(p)
            i++
        }

        let monsterPoints = 5 + state.day - state.camp.patrolKills

        //let monsterPoints = 1

        return ({
            day: state.day + 1,
            gameStatus: 1,
            grid,
            pawns,
            enemies,
            monsterPoints

        })
    },

    mapTileHover: (state, actions, id) => {
        let t = state.grid[id.y][id.x]
        let p = state.currentPawn

        if (state.tTimer && t.distance && !t.occupied) {
            clearTimeout(state.tTimer)
        }

        if (t.occupied) {
            t.occupied.isPlayer && actions.mapPawnHover(t.occupied)
        }

        if (state.turnPhase === 1 && t.distance && !t.occupied) {
            return ({
                magicLine: walkTo({ x: p.tX, y: p.tY }, id, state.grid),
                tHovered: id,
                tTimer: null
            })
        }
        return (null)
    },

    mapTileUnhover: (state, actions, id) => {

        state.pHovered && actions.mapPawnUnhover()

        if (state.magicLine && !state.tTimer) {
            let tTimer = setTimeout(() => actions.mapRemoveLine(), 20)
            return ({ tTimer })
        }

    },

    mapRemoveLine: () => {
        return ({
            tTimer: null,
            magicLine: null
        })
    },

    mapTileClick: (state, actions, id) => {

        let t = state.grid[id.y][id.x]

        if (state.turnPhase == 1 && !t.occupied && t.distance) {
            actions.pawnMove(id)
        }

        if (state.turnPhase == 1 && t.occupied == state.currentPawn) {
            actions.turnPhaseAction()
        }

    },

    mapPawnHover: (state, actions, pawn) => {
        return ({ pHovered: pawn })
    },

    mapPawnUnhover: () => {
        return ({ pHovered: null })
    },

    mapSetSkull: (state, actions, skull) => {

        if (skull) {
            setTimeout(() => actions.mapSetSkull(null), 1200)
        }

        return ({ skull })
    },

    //****PAWN************************************************************

    pawnCreate: (state, actions, gID) => {

        let guild = state.guilds[gID]

        let newPawn = {
            guild: guild.desc,
            gID,
            aegis: guild.aegis,
            fatigue: 0,

            attack: guild.attack,
            move: guild.move,
            health: guild.health,
            special: guild.special,
            isExhaust: false,
            tX: 0,
            tY: 0,
            x: 0,
            y: 0,
            color: guild.color,
            key: Math.random(),
            icon: "#p",

            isPlayer: true,
        }


        return { pawns: [...state.pawns, newPawn] }
    },

    pawnMove: (state, actions, dest) => {
        let p = state.currentPawn


        tween({
            start: { x: p.x, y: p.y },
            arr: walkTo({ x: p.tX, y: p.tY }, dest, state.grid)
                .map(v => ({ x: cT(v.x), y: cT(v.y) })),
            tickFN: actions.pawnMoveUpdate,
            endFN: actions.pawnMoveDone,
            duration: 50
        })

        state.grid[p.tY][p.tX].occupied = null

        p.tX = dest.x
        p.tY = dest.y
        state.grid[p.tY][p.tX].occupied = p
        if (p.isPlayer) { actions.pawnFatigue({ pawn: p, m: 2 }) }

        return {
            turnPhase: 2,
            currentPawn: p,
            magicLine: null
        }
    },

    pawnMoveUpdate: (state, actions, loc) => {
        let p = state.currentPawn
        p.x = loc.x
        p.y = loc.y

        return ({ currentPawn: p })

    },

    pawnMoveDone: (state, actions) => {
        if (state.currentPawn.isPlayer) {
            if (state.tHovered) {
                actions.mapPawnUnhover()
                actions.mapTileHover(state.tHovered)
            }
            actions.turnPhaseAction()
        } else {
            actions.turnEnemyAction(state.currentPawn)
        }
    },

    pawnDoNothing: (state, actions) => {
        actions.turnDone()
    },

    pawnMelee: (state, actions, t) => {
        let p = state.currentPawn
        actions.pawnFatigue({ pawn: p, m: 6 })
        actions.pawnDoAttack({ t, a: p.attack, r: 0, c: p.color })
    },

    pawnSpecial: (state, actions, t) => {
        let p = state.currentPawn
        let ps = p.special
        if (p.isPlayer) {
            actions.pawnFatigue({ pawn: p, m: ps.cost })
        }
        actions.pawnDoAttack({ t, a: ps.attack, r: 1, c: p.color })

    },

    pawnDoAttack: (state, actions, { t, a, r, c }) => { //target attack range color
        let p = state.currentPawn //TODO needed?

        let missle = { x: p.x, y: p.y, t, a, r, c }
        state.missle = missle //hack so that update missle can see it in case tick happens before return? don't know if required.


        let Twn = new Tweezer({
            start: { x: p.x, y: p.y },
            end: { x: t.x, y: t.y },
            duration: 170 + distance({tX: p.tX, tY: p.tY}, {tX: t.tX, tY: t.tY}) * 20
        })
            .on('tick', value => actions.pawnUpdateMissle(value))
            .on('done', value => actions.pawnFinishAttack(value))
            .begin()

        return ({
            missle,
            actList: [],
            turnPhase: 4
        })
    },


    pawnUpdateMissle: (state, actions, loc) => {
        let missle = state.missle
        missle.x = loc.x
        missle.y = loc.y
        return ({ missle })
    },

    pawnFinishAttack: (state, actions, loc) => {
        actions.pawnHurt({ pawn: state.missle.t, m: state.missle.a })
        actions.turnDone()        
    },



    pawnFatigue: (state, actions, e) => {
        e.pawn.fatigue += e.m
        if (e.pawn.fatigue < 0) {
            e.pawn.fatigue = 0
        }
        if (e.pawn.fatigue >= 100) {
            e.pawn.fatigue = 100
            e.pawn.isExhaust = true
        } else {
            e.pawn.isExhaust = false
        }
        return { pawns: [...state.pawns] }
    },


    pawnHurt: (state, actions, e) => {

        let t = e.pawn

        if (!t.isPlayer) {
            actions.monsterHurt(e)
            return null
        }

        if (t.isExhaust) {
            e.m *= 2
        } else {
            actions.pawnFatigue(e)
        }

        t.aegis -= e.m

        if (t.aegis > 0) {
            return ({ pawns: [...state.pawns] }) //armor remaining, so just return
        }

        //else distribute damage

        t.health += t.aegis
        t.aegis = 0

        //player dead! :(
        if (t.health < 1) {
            actions.pawnDeath(t)
        }

        return ({ pawns: [...state.pawns], missle: null })
    },

    pawnDeath: (state, actions, t) => {
        t.health = 0

        //add skull to grid
        actions.mapSetSkull({ tX: t.tX, tY: t.tY })

        //remove from grid
        state.grid[t.tY][t.tX].occupied = null

        //remove from initiative, if they are still there
        let i = state.initiative.indexOf(t)
        if (i > -1) {
            state.initiative.splice(i, 1)
        }

        //remove from pawn list
        if (t.isPlayer) {
            i = state.pawns.indexOf(t)
            state.pawns.splice(i, 1)
        } else {
            i = state.enemies.indexOf(t)
            state.enemies.splice(i, 1);
        }
    },

    //****MONSTER PAWNS************************************************************

    monsterCreate: (state, actions, { gID, tX, tY }) => {
        let guild = state.monsters[gID]

        let newPawn = {
            gID,

            attack: guild.attack,
            range: guild.range,
            move: guild.move,
            health: guild.health,

            tX,
            tY,
            x: cT(tX),
            y: cT(tY),
            color: "LightCoral",
            key: Math.random(),
            icon: guild.icon,

            isPlayer: false,
            needsSpawn: true
        }

        state.grid[tY][tX].occupied = newPawn

        return { enemies: [...state.enemies, newPawn] }

    },

    monsterHurt: (state, actions, e) => {
        let t = e.pawn
        t.health -= e.m

        //monster dead! :)
        if (t.health < 1) {
            actions.pawnDeath(t)
        }
        return ({ enemies: [...state.enemies] })
    },





    //****CAMP************************************************************

    campInit: (state, actions) => {

        let camp = state.camp

        camp.phase = 0
        camp.patrolKills = 0
        camp.phaseReport = ["", "", ""]


        return ({
            gameStatus: 2,
            turnPhase: 6,
            currentPawn: null,
            camp,
            pawns: [...state.pawns]
        })
    },

    campAdvance: (state, actions, e) => {

        let camp = state.camp

        camp.phaseReport[camp.phase] = e.report
        camp.supplies -= e.cost
        camp.pickGuild = false
        camp.phase++

        return ({
            camp
        })
    },

    campRest: (state, actions) => {

        if (!campSanity(state.camp)) { return null }
        for (let p of state.pawns) {
            actions.pawnFatigue({ pawn: p, m: -20 })
            let g = state.guilds[p.gID]
            p.aegis += 5
            if (p.aegis>g.aegis) {p.aegis=g.aegis}
            p.health += 1
            if (p.health>g.health) {p.health=g.health}
        }

        actions.campAdvance({ cost: 1, report: "The defenders rested." })

        return ({ pawns: [...state.pawns] })

    },

    campForage: (state, actions) => {

        if (!campSanity(state.camp, false)) { return null }

        if (isRare()) {
            actions.campAdvance({ cost: 0, report: "Sadly, no supplies were found..." })
        } else if (isRare()) {
            actions.campAdvance({ cost: -3, report: "A cache of supplies was found." })
        } else {
            actions.campAdvance({ cost: -2, report: "A few supplies were found." })
        }

    },

    campTrain: (state, actions) => {
        if (!campSanity(state.camp)) { return null }

        let camp = state.camp
        if (camp.train + 1 == 4 && state.pawns.length == 5) { return null } //max five defenders

        actions.campAddTraining()

        if (camp.train == 4) {
            actions.campTrainComplete()
        } else {
            actions.campAdvance({ cost: 1, report: "Training progresses..." })
        }
    },

    campAddTraining: (state) => {
        let camp = state.camp
        camp.train++
        return ({ camp })
    },

    campTrainComplete: (state) => {
        let camp = state.camp

        let guilds = state.guilds.map((g, i) => ({ ID: i, desc: g.desc }))
        shuffle(guilds)

        camp.pickGuild = [guilds[0], guilds[1], guilds[2]]
        camp.train = 0
        return (
            { camp })
    },


    campPickGuild: (state, actions, guild) => {
        actions.pawnCreate(guild)
        actions.campAdvance({ cost: 1, report: state.guilds[guild].desc + " has joined the defenders." })
    },

    campPatrol: (state, actions) => {
        if (!campSanity(state.camp)) { return null }

        if (isRare()) {
            actions.campAdvance({ cost: 1, report: "The patrol found no sleeping monsters to murder." })
        } else if (isRare()) {
            actions.campKillMons(4)
            actions.campAdvance({ cost: 1, report: "A large den of monsters were slain while they slumbered." })
        } else {
            actions.campKillMons(Math.floor(Math.random() * 3) + 1)
            actions.campAdvance({ cost: 1, report: "A few sleeping monsters were found and slain." })
        }
    },

    campKillMons: (state, actions, amount) => {
        let camp = state.camp

        camp.patrolKills = amount
        return ({
            camp
        })
    },

    campToMap: (state, actions) => {
        actions.mapInit()
    }

}