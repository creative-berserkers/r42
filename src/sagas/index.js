const {takeEvery, takeLatest } = ReduxSaga;
const { call, put } = ReduxSaga.effects

const socket = io()

socket.on('command', function(msg){
  console.log(msg)
});

let pendingCommands = []
let counter = 0
const sendCommand = (command)=>{
  return new Promise((resolve, reject)=>{
    socket.emit('command_request',{
      counter: counter,
      command: command
    })
    pendingCommands.push({counter:counter,resolve:resolve})
    counter++
  })
}

function* fetchUser(action) {
  const command = yield sendCommand(action.payload)
  yield put({type: 'USER_COMMAND', payload: command}) ;
}

function* rootSaga() {
  yield takeEvery('USER_COMMAND_REQUEST', fetchUser);
}

export default rootSaga;
