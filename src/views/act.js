import { h } from 'hyperapp'
import {TOP, LEFT, cT} from '../helpers'

export default ({ actList }) => {

    let acts = []

    for (let act of actList) {
        //a-action d-desc  t-target  (in px)     
        const pos = {
            top: cT(act.t.tY),
            left: cT(act.t.tX)
        }
        acts.push (<button style={pos} onclick={e=> act.a(act.t)} class="act"> {act.d} </button>)
    }


    const wrap = {
        position: "absolute",
        top: TOP + 37,
        left: LEFT + 10,
        margin: 0
    }

    return (
        <div style={wrap}>{acts}</div>
    )
}

