'use strict'

module.exports = {
  forEachPlayer(state, cb){
    state.getIn(['players']).forEach(player => {
      cb(player)
    })
  }
}
