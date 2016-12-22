const initialState = {
  messages: [{id:"1",text: 'test message 1'}, {id:"2",text: 'test message 2'}]
}

export default function rootReducer(state = initialState, action){
  console.log(state, action);
  return state;
}
