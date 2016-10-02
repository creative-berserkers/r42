const REROLL = 'r44/dice/REROLL'

export function reroll(numbers){
  return {
    type: REROLL,
    numbers: numbers
  }
}

export default function reducer(state=[1,2,3,4,5,6], action={}){
  switch(action.type){
    case REROLL : return [...action.numbers]
    default : return state
  }
}
