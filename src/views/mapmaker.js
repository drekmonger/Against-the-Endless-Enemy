import { h } from 'hyperapp'
import { cT, TOP, LEFT } from '../helpers'

export default ({ grid, hover, phase, unhover, select, init, pawns, line, cPawn, hPawn, skull, missle }) => {

    let baseMap = []
    let wallMap = []
    let glowMap = []

    let lineMap = []
    let pawnMap = []

    //*******TILES******
    for (let y = 0; y < 14; y++) {
        for (let x = 0; x < 22; x++) {
            let t = grid[y][x]
            let xP = cT(x)
            let yP = cT(y)

            baseMap.push(<rect x={xP} y={yP} href="#tile" width="50" height="50" key={t.tkeys}
                fill={t.grass} stroke="#5A5353"
                onmouseover={e => hover({ x, y })}
                onmouseleave={e => unhover({ x, y })}
                onclick={e => select({ x, y })}
            />)

            t.wall > 0 && wallMap.push(<rect x={xP} y={yP} href="#tile" width="50" height="50" key={t.tkeys + 1000}
                fill="#FFDEAD" pointer-events="none" />)

            if (phase == 1 && t.distance != null) { //turnPhase 1 is player movement

                glowMap.push(<rect x={xP} y={yP} href="#tile" width="50" height="50" key={t.tkeys}
                    fill={t.occupied != cPawn ? "rgba(0,100,0,0.2)" : "rgba(0,200,0,0.8)"} pointer-events="none" />)

            }
        }
    }

    //*******PAWNS******
    for (let p of pawns) {
        let r = 20
        if (p.isPlayer && p.special.range && !p.isExhaust) {
            r = p.special.range * 50
        }
        pawnMap.push(<use x={p.x} y={p.y} width="50" height="50" href={p.icon} fill={p.color} stroke="black" stroke-width="3" pointer-events="none" key={p.key} filter="url(#pf)" />)
        p === hPawn && pawnMap.push(<circle cx={p.x + 25} cy={p.y + 25} r={r} fill="white" fill-opacity="0.2" pointer-events="none" />)
    }

    //******MAGIC LINE**
    if (phase == 1 && line) {
        let prev = line[0]
        for (let s of line) {
            lineMap.push(<line x1={cT(prev.x) + 25} y1={cT(prev.y) + 25} x2={cT(s.x) + 25} y2={cT(s.y) + 25}
                stroke-width="3" stroke="white" pointer-events="none" />)
            prev = s
        }

        lineMap.push(<use x={cT(prev.x) + 7} y={cT(prev.y) + 5} width="35" height="35" href={cPawn.icon} fill="white" pointer-events="none" />)
    }


    const style = {
        position: "absolute",
        left: LEFT,
        top: TOP,
        width: 1000,
        height: 600,
        border: "10px solid #A07178",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
    }

    return <svg style={style}>
        <defs>
            <filter id="pf">
                <feDropShadow flood-opacity=".3" dx="3" dy="3" stdDeviation="0" />
            </filter>

            <filter id="wf" >
                <feMorphology operator="erode" radius="8" />
                <feDropShadow flood-opacity=".7" dx="3" dy="3" stdDeviation="2" />
                <feDropShadow flood-opacity=".1" dx="-3" dy="-3" stdDeviation="5" />
            </filter>

            <filter id="gf">
                <feMorphology result="r" in="SourceGraphic" operator="erode" radius="5" />
                <feBlend result="r2" in="SourceGraphic" in2="r" mode="screen" />

            </filter>

            <symbol id="p" viewBox="0 0 512 512">
                <path d="M263 18h-3c-33 0-60 34-60 76 0 21 7 40 18 54-68 11-83 105-67 192h24l-1-105h19l1 127 9 133h47V319h19v176h44l12-154 1-106h19l-1 105h25c18-88-5-179-67-191 12-14 19-33 19-55 0-39-23-72-53-76h-2" />
            </symbol>

            <symbol id="m1" viewBox="0 0 512 512">
                <path d="M0 0h512v512H0z" fill="none" /><path d="M323 144l-14 1c19 33 6 75-19 108-10-94-17-19-36-20-19 0-22-77-34 9-20-37-27-78-14-95C89 142 19 237 5 293c27-27 116-19 128 15 17-23 52-30 83-29-1 21 18 22 38 22s39-1 38-23c33-4 71 3 89 27 13-33 101-42 129-14-41-82-93-147-187-147z" />
            </symbol>

            <symbol id="m2" viewBox="0 0 512 512">
                <path d="M260 19c-74 0-134 52-134 112 17 56 39 80 40 139 60-51 23 54 11 74-146 119-128-51-87-13-75-132-161 199 112 74 6 139 177 72 100 14 9 42-48 47-49-13 0-23 11-43 27-57 149 290 301-142 131-4 67 3-10 114-65-1-12-38-52-109 8-74-19-56 38-90 39-139 0-60-58-112-133-112z" />
            </symbol>

            <symbol id="m3" viewBox="0 0 512 512">
                <path d="M148 252l54-34c47 77 4 93-52 153l13 86-43 52h53l22-50c-15-135 176-110 184 1l-11 49h69l-34-49-6-74c-84-70-91-81-59-178l68 23c-86 88-33 76 41-6-63-36-115-57-131-118 61-14 68-74 17-106 10 29 25 56-37 71-17-15-36-13-51 0-65-15-49-42-39-71-53 33-44 94 20 107 3 57-33 72-81 111-186-109-95-22 3 33z" />
            </symbol>

            <symbol id="m4" viewBox="0 0 512 512">
                <path d="M61 7c-6 73 67 87 117 115-183 3-208 247-51 262 52-42-9-109-57-61 5-163 111-30 119 57-61 58-23 99-98 134h107c-63-129 176-114 95 0h106c-81-20-47-104-98-134-8-137 197-195 113-61-48-48-105 23-52 65 283-99 40-269-42-260C372 94 465 56 442 7 376 117 75 60 61 7z" />
            </symbol>

            <symbol id="sk" viewBox="0 0 512 512">
                <path d="M5 197c0 50 23 97 63 133 19 34 9 92 11 134 9 5 29 15 59 25v-81h37v90c20 4 43 8 68 8v-83h37v83c26-1 50-5 70-10v-88h37v78c23-9 39-17 47-22 12-34-17-109 9-133 41-36 65-83 65-134C472-84 13-38 5 197zm209 10a78 78 0 0 1-156 0c21-69 111-23 156 0zm241 0a78 78 0 1 1-156 0c43-18 152-66 156 0z" />
            </symbol>
        </defs>

        <g>
            {baseMap}
        </g>

        <g filter="url(#wf)">
            {wallMap}
        </g>

        <g filter="url(#gf)">
            {glowMap}
        </g>

        <g opacity=".8">
            {lineMap}
        </g>

        {pawnMap}

        {skull && <use use x={cT(skull.tX)} y={cT(skull.tY)} width="50" height="50" href="#sk" fill="Ivory" filter="url(#pf)" pointer-events="none" />}

        {missle && phase == 4 && <rect x={missle.x + 25} y={missle.y + 25} rx={missle.r * 20} ry={missle.r * 20} height={2 + missle.a} width={2 + missle.a} fill={missle.c} stroke="black" pointer-events="none" />}

        
    </svg>
}