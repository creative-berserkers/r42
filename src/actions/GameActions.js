const GAME_INIT_ACTION = 'GAME_INIT_ACTION'
const PLAYER_CONNECTED = 'PLAYER_CONNECTED'
const PLAYER_DISCONNECTED = 'PLAYER_DISCONNECTED'

module.exports = {
  GAME_INIT_ACTION,
  createGameInitAction(state){
    return {
      type : GAME_INIT_ACTION,
      state : state
    }
  },
  PLAYER_CONNECTED,
  createPlayerConnectedAction(name){
    return {
      type : PLAYER_CONNECTED,
      name : name
    }
  },
  PLAYER_DISCONNECTED,
  createPlayerDisconnectedAction(name){
    return {
      type : PLAYER_DISCONNECTED,
      name : name
    }
  }
}
