import { h } from 'hyperapp'
import { TOP, LEFT } from '../helpers'

export default ({ camp, restFN, forageFN, patrolFN, trainFN, guildFN, battleFN }) => {

    let style = {
        position: "absolute",
        left: LEFT,
        top: TOP-20,
    }

    let test = () => (camp.phase != 3 && camp.pickGuild==false)

    return (
        <div style={style} class="campd">
            <h2> Supplies: {camp.supplies} </h2>
            <div>Morning: {camp.phaseReport[0]} </div>
            <div>Noon: {camp.phaseReport[1]} </div>
            <div>Afternoon: {camp.phaseReport[2]} </div>
            <br/>
            {test() && <CB label="REST" desc="regain twenty stamina, repair five armor, heal one health" supplies={camp.supplies} fn={restFN} />}
            {test() && <CB label="FORAGE" desc="find supplies" supplies={camp.supplies} fn={forageFN} cost={false} />}
            {test() && <CB label="TRAIN" desc={"recruit a new defender (max five defenders) (" + (4 - camp.train) + " more needed)"} supplies={camp.supplies} fn={trainFN} />}
            {test() && camp.patrolKills == 0 && <CB label="PATROL" desc="slay sleeping monsters" supplies={camp.supplies} fn={patrolFN} />}
            
            {camp.pickGuild && <div class='campd'>
                <h2> A new defender joins. Select a guild:</h2>
                {camp.pickGuild.map(g => <button class='camp' onclick={e => guildFN(g.ID)}><h1 class="camph">{g.desc}</h1></button>)}
            </div>}
            
            {camp.phase == 3 && <CB label="TO BATTLE" desc="the monsters awaken" fn={battleFN} supplies={camp.supplies} cost={false} />}
        </div>
    )
}

let CB = ({ label, desc, fn, supplies, cost = true }) => {

    let disabled = false
    if (cost && supplies == 0) { disabled = true }
    return (
        <button class='camp' onclick={e => fn()} disabled={disabled} >
            {cost && <span>costs one supply</span>}
            <h1 class='camph'>{label}</h1>{desc}</button>
    )
} 