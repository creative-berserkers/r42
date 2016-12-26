import {expect} from 'chai'
import shallowEqual from './shallow-equal'

describe('changed', ()=>{
  it('should return true', ()=>{
    const oldState = {a:'1', b:'43'}
    const newState = {b:'43',a:'1'}
    const result = shallowEqual(oldState, newState)
    expect(result).to.equal(true)
  })

  it('should return newState', ()=>{
    const oldState = {a:'1', b:{}}
    const newState = {a:'1', b:{}}
    const result = shallowEqual(oldState, newState)
    expect(result).to.equal(false)
  })
})