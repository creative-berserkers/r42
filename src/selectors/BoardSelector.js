'use strict'

module.exports = {
  getBoardSize(state){
    return {
      width : state.getIn(['board', 'width']),
      height : state.getIn(['board', 'height'])
    }
  }
}
