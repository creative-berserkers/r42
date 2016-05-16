'use strict'
const {element} = require('deku')
const CellView = require('./CellView')

const GRID_SIZE = 40

module.exports = {
  render({props, context}) {
    const intersections = []
    for (var i = 0; i < props.size.height; i++)
        for (var j = 0; j < props.size.width; j++)
            intersections.push(<CellView
                gridSize={GRID_SIZE}
                row={i}
                col={j}
                onClick={props.onClick} >
              </CellView>
            )
    const style = `
        width: ${props.size.width * GRID_SIZE}px;
        height: ${props.size.height * GRID_SIZE}px;
    `
    return <div style={style} class="board-view" id="board">{intersections}</div>
  }
}
