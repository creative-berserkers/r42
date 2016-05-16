'use strict'

const {element} = require('deku')

let handleClick = (props) => (event)=>{
  props.onClick(props.row, props.col)
}

module.exports = {
  render({props}) {
    let style = `
      top:${props.row*props.gridSize}px;
      left:${props.col*props.gridSize}px;
    `
    return (
        <div key={props.row*props.gridSize+props.col} onClick={handleClick(props)} class="cell-view" style={style}></div>
    );
  }
}
