//import {} from '../actions/GBCActions'
const {GAME_INIT_ACTION, PLAYER_CONNECTED, PLAYER_DISCONNECTED} = require('../actions/GameActions')
const Immutable = require('immutable')
const {Map, List} = Immutable

const initialState = new Map({
  board : new Map({
    width: 8,
    height: 8,
    data : new List()
  }),
  players: new List()
})

module.exports = function GameReducer(state = initialState, action) {
  switch (action.type) {
    case GAME_INIT_ACTION :
      return Immutable.fromJS(action.state)
    case PLAYER_CONNECTED :
      return state.updateIn(['players'], players => players.push(new Map({
        name : action.name,
        positionX : 0,
        positionY : 0
      })))
    case PLAYER_DISCONNECTED:
      return state.updateIn(['players'], players => players.filter( (player) => player.get('name') !== action.name))
    default:
      return state
  }
}
