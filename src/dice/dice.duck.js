const REROLL = 'r44/dice/REROLL'

export function reroll(numbers){
  return {
    type: REROLL,
    numbers: numbers
  }
}

const initialState = {
  numbers : []
}

export default function reducer(state=initialState, action={}){
  switch(action.type){
    case REROLL : return {
      numbers : [...action.numbers]
    }
    default : return state
  }
}
