import { h } from 'hyperapp'
import { TOP } from '../helpers'

export default ({ pawn, guild, i, current, highlight, hover, unhover }) => {



    const styleCard = {
        top: i * 130 + TOP,
        background: highlight ? pawn.color : "none",
    }
    const styleTitle = {
        background: current ? "#A07178" : "none",
        color: current ? "white" : "black",
        textShadow: current ? "1px 1px #050505" : "none",
    }

    let f = pawn.fatigue

    return (
        <div style={styleCard} class="cc" onmouseover={e => hover(pawn)} onmouseleave={unhover}>
            <div style={styleTitle} class="ct">{current ? ">" + pawn.guild + "<" : pawn.guild}</div>
            <R s="Armor" a={pawn.aegis} max={guild.aegis}/>
            <R s="Health" a={pawn.health} max={guild.health}/>
            {f != 100 && <R s="Fatigue" a={f} fa={true}/>}
            {f == 100 && <R s="FATIGUED!" a="100" fa={true}/>}
            <R s="Attack" a={pawn.attack}/>
            <R s="Move" a={pawn.move} b={false}/>
        </div>
    )
}

const R = ({ s, a, max=false, b = true, fa = false}) => {
    const style = {
        borderBottom: b ? "1px solid #A07178" : "none"
    }

    return (
        <div class="cr" style={style} a={a}
            oncreate={
                (e) => e.style.background = "inherit"
            }
            onupdate={
                (e, o) => {
                    if (o.a != a) {
                        if (fa) { e.style.background = o.a < a ? "LightCoral" : "Lime" } else {
                            e.style.background = o.a > a ? "LightCoral" : "Lime"
                        }
                        e.style.color = "White"
                        let d = setTimeout(() => {
                            e.style.background = "inherit"
                            e.style.color = "inherit"
                        }, 1400)
                    }
                }
            }>
            <div class="ca">{s}</div>
            <div class="ca">{a<100 && a}
            {max && <span class="cam">|{max}</span>}
            </div>
        </div>
    )
}

//