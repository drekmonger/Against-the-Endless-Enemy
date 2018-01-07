import { h } from 'hyperapp'
import Map from './mapmaker.js'
import Ccard from './ccard.js'
import ActOverlay from './act.js'
import Camp from './camp.js'
import { TOP, LEFT } from '../helpers'

//main
export default (state, actions) => {

  let s = state.gameStatus
  return (

    <main>

      {//title
        s == 0 &&
        <div>
          <h1>Against the Endless Enemy</h1><br />
          <button onclick={actions.gameInit} class="camp">how long can you survive...?<h1 class='camph'>Begin</h1></button>
        </div>
      }

      {//day counter
        s > 0 && <h1>Day {state.day} {s == 2 && <span> --- Camp </span>}</h1>
      }

      {//character cards
        s > 0 &&
        <div>
          {state.pawns.map((p, i) => {
            return <Ccard pawn={p} guild={state.guilds[p.gID]} i={i} current={p == state.currentPawn} highlight={state.pHovered == p}
              hover={actions.mapPawnHover} unhover={actions.mapPawnUnhover} />
          })}
        </div>
      }

      {//map
        (s == 1 || s > 2) && <Map grid={state.grid} pawns={[...state.pawns, ...state.enemies]} phase={state.turnPhase} line={state.magicLine} cPawn={state.currentPawn} hPawn={state.pHovered}
          skull = {state.skull} missle = {state.missle}
          hover={actions.mapTileHover} unhover={actions.mapTileUnhover} select={actions.mapTileClick} />
      }

      {//action overlay
        state.turnPhase == 3 && <ActOverlay actList={state.actList} />
      }

      {//camp
        s == 2 && <Camp camp={state.camp}
          restFN={actions.campRest} forageFN={actions.campForage} patrolFN={actions.campPatrol} trainFN={actions.campTrain} guildFN={actions.campPickGuild} battleFN={actions.campToMap} />
      }


      {//game over, victory
        s == 3 && <Go msgt="the monsters have been beaten back" msg="VICTORY" msgb="proceed to camp..." fn={actions.campInit} />
      }

      {//game over, defeat
        s == 4 && <Go msgt={"you survived for " + state.day + " days"} msg="DEFEAT" msgb="play again?" fn={actions.gameInit} />
      }
    </main>
  )
}


let Go = ({ msgt, msg, msgb, fn }) => {
  let style = {
    position: "absolute",
    left: LEFT + 150,
    top: TOP - 40,
  }

  return (
    <button class='camp' onclick={e => fn()} style={style}>
      {msgt}
      <h1>{msg}</h1>
      {msgb}
    </button>
  )
}

//