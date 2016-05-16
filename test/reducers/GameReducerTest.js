const chai = require('chai')
const chaiImmutable = require('chai-immutable');
const GameReducer = require('../../src/reducers/GameReducer')
const Immutable = require('immutable')
const {Map, List} = Immutable
const {
  createGameInitAction,
  createPlayerConnectedAction,
  createPlayerDisconnectedAction
} = require('../../src/actions/GameActions')

chai.use(chaiImmutable);
const {expect} = chai

describe('GameReducer', () => {
  it('should return the initial state', () => {
    expect(
      GameReducer(undefined, {})
    ).to.equal(new Map({
      board : new Map({
        width: 8,
        height: 8,
        data : new List()
      }),
      players: new List()
    }))
  })

  it('should add player to the players list', () => {
    expect(
      GameReducer(undefined, createPlayerConnectedAction('playerA'))
    ).to.equal(new Map({
      board : new Map({
        width: 8,
        height: 8,
        data : new List()
      }),
      players: new List([
        new Map({
          name : 'playerA',
          positionX : 0,
          positionY : 0
        })
      ])
    }))
  })

  it('should remove player from the players list', () => {
    const state = new Map({
      board : new Map({
        width: 8,
        height: 8,
        data : new List()
      }),
      players: new List([
        new Map({
          name : 'playerA',
          positionX : 0,
          positionY : 0
        })
      ])
    })
    expect(
      GameReducer(state, createPlayerDisconnectedAction('playerA'))
    ).to.equal(new Map({
      board : new Map({
        width: 8,
        height: 8,
        data : new List()
      }),
      players: new List()
    }))
  })
})
