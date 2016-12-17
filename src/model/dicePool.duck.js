const SWITCH_DICE_LOCK = 'r44/dicepool/SWITCH_DICE_LOCK'

export function switchDiceLock(diceNumber){
  return {
    type : SWITCH_DICE_LOCK,
    diceNumber : diceNumber
  }
}

export default function (state=[], action){
  switch(action.type){
    case SWITCH_DICE_LOCK :
      const newState = state.slice(0)
      newState[action.diceNumber] = !newState[action.diceNumber]
      return newState
    default : return state
  }
}
