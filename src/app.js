import { app } from 'hyperapp'
import actions from './actions/actions.js'
import state from './state/state.js'
import view from './views/mainview.js'

app({ state, actions, view })



