import {expect} from 'chai'
import Memory from './../../src/gbc/Memory'

describe('Memory test', ()=>{

  it('should throw exception on wrong buffer size',()=>{
    const buffer = new ArrayBuffer(10000)
    expect(Memory.createMemory.bind(undefined, buffer)).to.throw(Error)
  })

  it('should write and read byte from memory',()=>{
    const memory = Memory.createEmptyMemory()

    memory.writeByte(0x0000, 260)
    expect(memory.readByte(0x0000)).to.equal(4)
  })

  it('should write and read word from memory',()=>{
    const memory = Memory.createEmptyMemory()

    memory.writeWord(0x0000, 65540)
    expect(memory.readWord(0x0000)).to.equal(4)
  })

  it('should modify 8bit registers respecting overflow',()=>{
    const registers = ['A','B','C','D','E','H','L','F']
    const memory = Memory.createEmptyMemory()

    registers.forEach((reg, index)=>{
      memory.setReg8(reg, 260)
      expect(memory.reg8(reg)).to.equal(4)
    })
  })

  it('Should throw unknown register on 8bit register read and write',()=>{
    const memory = Memory.createEmptyMemory()
    expect(memory.setReg8.bind(undefined, 'X', 1)).to.throw('Unknown register X')
    expect(memory.reg8.bind(undefined, 'X')).to.throw('Unknown register X')
  })

  it('should modify PC register respecting overflow',()=>{
    const memory = Memory.createEmptyMemory()

    memory.setPC(65540)
    expect(memory.PC()).to.equal(4)
  })

  it('should modify SP register respecting overflow',()=>{
    const memory = Memory.createEmptyMemory()

    memory.setSP(65540)
    expect(memory.SP()).to.equal(4)
  })

  it('should modify clock register',()=>{
    const memory = Memory.createEmptyMemory()

    memory.setClock(4294967295)
    expect(memory.clock()).to.equal(4294967295)
  })

  it('should modify last instruction clock register',()=>{
    const memory = Memory.createEmptyMemory()

    memory.setLastInstructionClock(16)
    expect(memory.lastInstructionClock()).to.equal(16)
  })

  it('should set Zero Flag', ()=>{
    const memory = Memory.createEmptyMemory()
    memory.setZeroFlag(true)
    expect(memory.zeroFlag()).to.equal(true)
    memory.setZeroFlag(false)
    expect(memory.zeroFlag()).to.equal(false)
  })

  it('should set Subtract Flag', ()=>{
    const memory = Memory.createEmptyMemory()
    memory.setSubtractFlag(true)
    expect(memory.subtractFlag()).to.equal(true)
    memory.setSubtractFlag(false)
    expect(memory.subtractFlag()).to.equal(false)
  })

  it('should set Half Carry Flag', ()=>{
    const memory = Memory.createEmptyMemory()
    memory.setHalfCarryFlag(true)
    expect(memory.halfCarryFlag()).to.equal(true)
    memory.setHalfCarryFlag(false)
    expect(memory.halfCarryFlag()).to.equal(false)
  })

  it('should set Carry Flag', ()=>{
    const memory = Memory.createEmptyMemory()
    memory.setCarryFlag(true)
    expect(memory.carryFlag()).to.equal(true)
    memory.setCarryFlag(false)
    expect(memory.carryFlag()).to.equal(false)
  })
})