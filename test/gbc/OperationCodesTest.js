import * as opcodes from '../../src/gbc/OperationCodes'
import Memory,{reg8} from './../../src/gbc/Memory'
import {expect} from 'chai'

function expectNumberOfCycle(cycle, memory){
  it(`should take ${cycle} cycle`,()=>{
    expect(memory.lastInstructionClock()).to.equal(cycle)
  })
}

function expectZeroFlag(flag, memory){
  it(`should set zero flag to ${flag}`,()=>{
    expect(memory.zeroFlag()).to.equal(flag)
  })
}

function expectSubtractFlag(flag, memory){
  it(`should set subtract flag to ${flag}`,()=>{
    expect(memory.subtractFlag()).to.equal(flag)
  })
}

function expectHalfCarryFlag(flag, memory){
  it(`should set half carry flag to ${flag}`,()=>{
    expect(memory.halfCarryFlag()).to.equal(flag)
  })
}

function expectCarryFlag(flag, memory){
  it(`should set carry flag to ${flag}`,()=>{
    expect(memory.carryFlag()).to.equal(flag)
  })
}

describe('Operation codes test', ()=>{
  describe('NOP', ()=> {
    const memory = Memory.createEmptyMemory()
    opcodes.NOP(memory)

    expectNumberOfCycle(1,memory)
  })

  describe('LD_XY_d16',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0001)
    memory.setReg8(reg8.B, 0)
    memory.setReg8(reg8.C, 0)
    memory.writeByte(0x0001, 14)
    memory.writeByte(0x0002, 19)

    opcodes.LD_XY_d16(reg8.B,reg8.C, memory)

    it('should load memory[PC] to Y register',()=>{
      expect(memory.reg8(reg8.C)).to.equal(14)
    })
    it('should load memory[PC+1] to X register',()=>{
      expect(memory.reg8(reg8.B)).to.equal(19)
    })
    it('should increase PC by 2',()=>{
      expect(memory.PC()).to.equal(3)
    })
    expectNumberOfCycle(3,memory)
  })

  describe('LD_XY_Z',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.B, 0)
    memory.setReg8(reg8.C, 1)
    memory.setReg8(reg8.A, 18)
    memory.writeByte(0x0001, 0)

    opcodes.LD_XY_Z(reg8.B,reg8.C, reg8.A, memory)

    it('should write into memory[X<<8+Y] value from Z',()=>{
      expect(memory.readByte(0x0001)).to.equal(18)
    })

    expectNumberOfCycle(2, memory)
  })

  describe('INC_XY',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.B, 255)
    memory.setReg8(reg8.C, 255)

    opcodes.INC_XY(reg8.B,reg8.C, memory)

    it('should increment value stored in XY by 1 and respect overflow',()=>{
      expect(memory.reg8(reg8.B)).to.equal(0)
      expect(memory.reg8(reg8.C)).to.equal(0)
    })

    expectNumberOfCycle(2, memory)
  })

  describe('INC_X', ()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.B, 15)

    opcodes.INC_X(reg8.B, memory)

    it('should increment X by 1',()=>{
      expect(memory.reg8(reg8.B)).to.equal(16)
    })

    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(true, memory)
    expectNumberOfCycle(1, memory)
  })

  describe('DEC_X',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.B, 0)
    opcodes.DEC_X(reg8.B, memory)

    it('should decrement X',()=>{
      expect(memory.reg8(reg8.B)).to.equal(255)
    })

    expectZeroFlag(false, memory)
    expectSubtractFlag(true, memory)
    expectHalfCarryFlag(true, memory)
    expectNumberOfCycle(1, memory)
  })

  describe('LD_X_d8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0001)
    memory.setReg8(reg8.B, 0)
    memory.writeByte(0x0001, 29)

    opcodes.LD_X_d8(reg8.B, memory)
    it('should load memory[PC] into register X',()=>{
      expect(memory.reg8(reg8.B)).to.equal(29)
    })

    it('should increase PC by 1',()=>{
      expect(memory.PC()).to.equal(2)
    })

    expectNumberOfCycle(2,memory)
  })

  describe('RLC_X',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 130)
    memory.setZeroFlag(true)
    memory.setSubtractFlag(true)
    memory.setHalfCarryFlag(true)
    memory.setCarryFlag(false)

    opcodes.RLC_X(reg8.A, memory)

    it('should rotate register X to the left respecting carry',()=>{
      expect(memory.reg8(reg8.A)).to.equal(5)
    })

    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(false, memory)
    expectCarryFlag(true, memory)
    expectNumberOfCycle(1,memory)
  })

  describe('LD_a16_SP',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0001)
    memory.setSP(17)
    memory.writeWord(0x0001, 0x0003)
    memory.writeWord(0x0003, 0)

    opcodes.LD_a16_SP(memory)

    it('should copy to memory[memory[PC]] value from SP',()=>{
      expect(memory.readWord(0x0003)).to.equal(17)
    })
    
    expectNumberOfCycle(5, memory)
  })

  describe('ADD_XY_ZQ',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.H, 15)
    memory.setReg8(reg8.L, 255)
    memory.setReg8(reg8.B, 0)
    memory.setReg8(reg8.C, 1)

    opcodes.ADD_XY_ZQ(reg8.H, reg8.L, reg8.B, reg8.C, memory)

    it('should add XY to ZQ and store result in XY',()=>{
      expect(memory.reg8(reg8.H)).to.equal(16)
      expect(memory.reg8(reg8.L)).to.equal(0)
    })
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('LD_X_YZ',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 0)
    memory.setReg8(reg8.B, 0)
    memory.setReg8(reg8.C, 1)
    memory.writeByte(0x0001, 35)

    opcodes.LD_X_YZ(reg8.A, reg8.B, reg8.C, memory)

    it('should load memory[YZ] and store it into X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(35)
    })
    expectNumberOfCycle(2, memory)
  })

  describe('DEC_XY',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.B, 0)
    memory.setReg8(reg8.C, 0)
    opcodes.DEC_XY(reg8.B, reg8.C, memory)

    it('should decrement XY by 1',()=>{
      expect(memory.reg8(reg8.B)).to.equal(255)
      expect(memory.reg8(reg8.C)).to.equal(255)
    })
    expectNumberOfCycle(2, memory)
  })

  describe('RRC_X',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 129)
    memory.setZeroFlag(true)
    memory.setSubtractFlag(true)
    memory.setHalfCarryFlag(true)
    memory.setCarryFlag(false)

    opcodes.RRC_X(reg8.A, memory)
    it('should rotate register X to the right respecting carry',()=>{
      expect(memory.reg8(reg8.A)).to.equal(192)
    })
  })
  
  describe('STOP',()=>{
    const memory = Memory.createEmptyMemory()
    
    opcodes.STOP(memory)
    it('should set stop flag',()=>{
      expect(memory.stopFlag()).to.equal(true)
    })
    expectNumberOfCycle(1, memory)
  })

  describe('RL_X',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 130)
    memory.setZeroFlag(true)
    memory.setSubtractFlag(true)
    memory.setHalfCarryFlag(true)
    memory.setCarryFlag(true)

    opcodes.RL_X(reg8.A, memory)
    it('should rotate register X to the left',()=>{
      expect(memory.reg8(reg8.A)).to.equal(5)
    })
    expectNumberOfCycle(1,memory)
  })

  describe('JR_r8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0001)
    memory.writeByte(0x0001,3)

    opcodes.JR_r8(memory)
    it('should increase PC by memory[PC]',()=>{
      expect(memory.PC()).to.equal(5)
    })
    expectNumberOfCycle(3, memory)
  })

  describe('RR_X',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, parseInt('10000010', 2))
    memory.setZeroFlag(true)
    memory.setSubtractFlag(true)
    memory.setHalfCarryFlag(true)
    memory.setCarryFlag(true)

    opcodes.RR_X(reg8.A, memory)
    it('should rotate register right',()=>{
      expect(memory.reg8(reg8.A)).to.equal(parseInt('11000001',2))
    })
    expectNumberOfCycle(1, memory)
  })
})