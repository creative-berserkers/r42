import {expect} from 'chai'
import changed from './changed'

describe('changed', ()=>{
  it('should return oldState', ()=>{
    const oldState = {a:'1', b:'43'}
    const newState = {b:'43',a:'1'}
    const result = changed(oldState, newState)
    expect(result).to.equal(oldState)
  })

  it('should return newState', ()=>{
    const oldState = {a:'1', b:{}}
    const newState = {a:'1', b:{}}
    const result = changed(oldState, newState)
    expect(result).to.equal(newState)
  })
})