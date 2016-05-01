'use strict'
const {element} = require('deku')
const CellView = require('./CellView')

const GRID_SIZE = 40

module.exports = {
  render({props}) {
    const intersections = []
    for (var i = 0; i < props.board.size; i++)
        for (var j = 0; j < props.board.size; j++)
            intersections.push(<CellView
                board={props.board}
                gridSize={GRID_SIZE}
                row={i}
                col={j}
                onClick={props.onClick} >
              </CellView>
            )
    const style = `
        width: ${props.board.size * GRID_SIZE}px;
        height: ${props.board.size * GRID_SIZE}px;
    `
    return <div style={style} class="board-view" id="board">{intersections}</div>
  }
}
