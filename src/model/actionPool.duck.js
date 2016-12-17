const PLAY_ACTION = 'r44/actionpool/PLAY_ACTION'

export function playAction(number){
    return {
      type : PLAY_ACTION,
      number : number
    }
}

const initialState = [
  {name:'Shielding', initiative: false, locking:true, require:[1], stack:1, stat:'str'},
  {name:'Maneuver',initiative:false,locking:false,require:[3],stack:2,stat:'none'},
  {name:'Throw', initiative:true, locking:false,require:[6], stack:2,stat:'str'},
  {name:'Shock', initiative:false, locking: false, require:[6], stack:2, stat:'int'},
  {name:'Garlic Breath', initiative: false, locking: false, require:[5],stack:1, stat:'none'}
]

export default function reducer(state = initialState,action){
  return state
}
