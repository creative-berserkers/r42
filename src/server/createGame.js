import {createStore, applyMiddleware} from 'redux'
import {guid} from 'utils'

export default function createGame(){

  let clients = []

  const broadcaster = ({ getState })=>{
    return (next) => (action) => {
      clients.forEach((client)=>{
        client.ws.send(JSON.stringify(action))
      })
      return next(action)
    }
  }
  const store = createStore((state)=>{return state}, undefined, applyMiddleware(broadcaster))

  let gameStarted = ()=>{}

  let clientConnected = (ws)=>{
    const client = {
      ws,
      guid : guid()
    }

    ws.on('close', () => {
      clients = clients.filter((cl) => cl.ws !== ws)
      //store.dispatch(createPlayerDisconnectedAction(client.guid))
    });
    ws.on('message', (msg) => {})
    //store.dispatch(createPlayerConnectedAction(client.guid))
    //ws.send(JSON.stringify(createGameInitAction(store.getState().toJS())))
    clients.push(client)
  }

  return {
    gameStarted,
    clientConnected
  }
}
