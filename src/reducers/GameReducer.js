//import {} from '../actions/GBCActions'

let generateRandomBoard = (width, height) => {
  const data = []
  for(let i=0; i<width*height;++i){
    data.push({isObstacle:false})
  }
  return data
}

const initialState = {
  board : {
    size : { widt : 8, height : 8},
    data : generateRandomBoard(8,8)
  },
  players: [
    {
      name : 'player1',
      position : {
        x : 0,
        y : 0
      }
    }
  ]
}

module.exports = function GameReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}
