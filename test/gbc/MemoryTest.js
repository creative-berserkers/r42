import {expect} from 'chai'
import Memory, {reg8, flags} from './../../src/gbc/Memory'

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
    const registers = [reg8.A,reg8.B,reg8.C,reg8.D,reg8.E,reg8.H,reg8.L,reg8.F]
    const memory = Memory.createEmptyMemory()

    registers.forEach((reg)=>{
      memory.setReg8(reg, 260)
      expect(memory.reg8(reg)).to.equal(4)
    })
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

  const testFlags = [flags.zero, flags.subtract, flags.halfCarry, flags.carry]
  const memory = Memory.createEmptyMemory()

  it('should set and read flags', ()=>{
    testFlags.forEach((flag)=>{
      memory.setFlag(flag, true)
      expect(memory.flag(flag)).to.equal(true)
      memory.setFlag(flag, false)
      expect(memory.flag(flag)).to.equal(false)
    })
  })
})