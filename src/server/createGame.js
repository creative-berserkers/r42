'use strict'

const actions = require('../actions/GameActions')
const GameReducer = require('../reducers/GameReducer')
const Redux = require('redux')
const Guid = require('guid')

const {
  createGameInitAction,
  createPlayerConnectedAction,
  createPlayerDisconnectedAction
} = actions

const {createStore, applyMiddleware} = Redux

module.exports = function createGame(){

  let clients = []

  const broadcaster = ({ getState })=>{
    return (next) => (action) => {
      clients.forEach((client)=>{
        client.ws.send(JSON.stringify(action))
      })
      return next(action)
    }
  }
  const store = createStore(GameReducer, undefined, applyMiddleware(broadcaster))

  let gameStarted = ()=>{}

  let clientConnected = (ws)=>{
    const client = {
      ws,
      guid : Guid.raw()
    }

    ws.on('close', () => {
      clients = clients.filter((cl) => cl.ws !== ws)
      store.dispatch(createPlayerDisconnectedAction(client.guid))
    });
    ws.on('message', (msg) => {})
    store.dispatch(createPlayerConnectedAction(client.guid))
    ws.send(JSON.stringify(createGameInitAction(store.getState().toJS())))
    clients.push(client)
  }

  return {
    gameStarted,
    clientConnected
  }
}
