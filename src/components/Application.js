'use strict'
const {element} = require('deku')
const BoardView = require('./BoardView')

let handleClick = (x,y) => {
  console.log(x,y)
}

module.exports = {
  render({context}) {
    return (
        <div>
          <BoardView board={context.board} onClick={handleClick}></BoardView>
        </div>
    )
  }
}
