'use strict'
const {element} = require('deku')
const {getBoardSize} = require('../selectors/BoardSelector')
const {forEachPlayer} = require('../selectors/PlayerSelector')
const BoardView = require('./BoardView')

let handleClick = (x,y) => {
  console.log(x,y)
}

module.exports = {
  render({context}) {
    const size = getBoardSize(context)
    forEachPlayer(context, (player) => console.log(player))
    return (
        <div>
          <BoardView size={size} onClick={handleClick}></BoardView>
        </div>
    )
  }
}
