import * as opcodes from '../../src/gbc/PrefixedOperationCodes'
import Memory,{reg8, flags} from './../../src/gbc/Memory'
import {expect} from 'chai'

function expectNumberOfCycle(cycle, memory){
  it(`should take ${cycle} cycle`,()=>{
    expect(memory.lastInstructionClock()).to.equal(cycle)
  })
}

function expectZeroFlag(flag, memory){
  it(`should set zero flag to ${flag}`,()=>{
    expect(memory.flag(flags.zero)).to.equal(flag)
  })
}

function expectSubtractFlag(flag, memory){
  it(`should set subtract flag to ${flag}`,()=>{
    expect(memory.flag(flags.subtract)).to.equal(flag)
  })
}

function expectHalfCarryFlag(flag, memory){
  it(`should set half carry flag to ${flag}`,()=>{
    expect(memory.flag(flags.halfCarry)).to.equal(flag)
  })
}

function expectCarryFlag(flag, memory){
  it(`should set carry flag to ${flag}`,()=>{
    expect(memory.flag(flags.carry)).to.equal(flag)
  })
}

describe('RLC_X',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.B, 129)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.RLC_X(reg8.B, memory)
  it('should rotate register X to the left respecting carry',()=>{
    expect(memory.reg8(reg8.B)).to.equal(3)
  })
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(true, memory)
  expectHalfCarryFlag(false, memory)
  expectNumberOfCycle(2, memory)
})

describe('RLC_mXY',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.H, 0)
  memory.setReg8(reg8.L, 2)
  memory.writeByte(0x0002, 129)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.RLC_mXY(reg8.H,reg8.L, memory)
  it('should rotate register XY to the left respecting carry',()=>{
    expect(memory.readByte(0x0002)).to.equal(3)
  })
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(true, memory)
  expectHalfCarryFlag(false, memory)
  expectNumberOfCycle(4, memory)
})

describe('RRC_X',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.B, 129)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.RRC_X(reg8.B, memory)
  it('should rotate register X to the left respecting carry',()=>{
    expect(memory.reg8(reg8.B)).to.equal(128)
  })
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(true, memory)
  expectHalfCarryFlag(false, memory)
  expectNumberOfCycle(2, memory)
})

describe('RRC_mXY',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.H, 0)
  memory.setReg8(reg8.L, 2)
  memory.writeByte(0x0002, 129)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.RRC_mXY(reg8.H,reg8.L, memory)
  it('should rotate register XY to the left respecting carry',()=>{
    expect(memory.readByte(0x0002)).to.equal(192)
  })
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(true, memory)
  expectHalfCarryFlag(false, memory)
  expectNumberOfCycle(4, memory)
})

describe('RL_X',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.B, 129)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.RL_X(reg8.B, memory)
  it('should rotate register X to the right',()=>{
    expect(memory.reg8(reg8.B)).to.equal(2)
  })
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(true, memory)
  expectHalfCarryFlag(false, memory)
  expectNumberOfCycle(2, memory)
})

describe('RL_mXY',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.H, 0)
  memory.setReg8(reg8.L, 2)
  memory.writeByte(0x0002, 129)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.RL_mXY(reg8.H,reg8.L, memory)
  it('should rotate register XY to the right',()=>{
    expect(memory.readByte(0x0002)).to.equal(2)
  })
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(true, memory)
  expectHalfCarryFlag(false, memory)
  expectNumberOfCycle(4, memory)
})

describe('RR_X',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.B, 129)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.RR_X(reg8.B, memory)
  it('should rotate register X to the right',()=>{
    expect(memory.reg8(reg8.B)).to.equal(64)
  })
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(true, memory)
  expectHalfCarryFlag(false, memory)
  expectNumberOfCycle(2, memory)
})

describe('RR_mXY',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.H, 0)
  memory.setReg8(reg8.L, 2)
  memory.writeByte(0x0002, 129)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.RR_mXY(reg8.H,reg8.L, memory)
  it('should rotate register XY to the right',()=>{
    expect(memory.readByte(0x0002)).to.equal(64)
  })
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(true, memory)
  expectHalfCarryFlag(false, memory)
  expectNumberOfCycle(4, memory)
})

describe('SLA_X',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.B, 129)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.SLA_X(reg8.B, memory)
  it('should rotate register X to the left',()=>{
    expect(memory.reg8(reg8.B)).to.equal(2)
  })
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(true, memory)
  expectHalfCarryFlag(false, memory)
  expectNumberOfCycle(2, memory)
})

describe('SLA_mXY',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.H, 0)
  memory.setReg8(reg8.L, 2)
  memory.writeByte(0x0002, 129)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.SLA_mXY(reg8.H,reg8.L, memory)
  it('should rotate register XY to the left',()=>{
    expect(memory.readByte(0x0002)).to.equal(2)
  })
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(true, memory)
  expectHalfCarryFlag(false, memory)
  expectNumberOfCycle(4, memory)
})

describe('SRA_X',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.B, 129)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.SRA_X(reg8.B, memory)
  it('should rotate register X to the right',()=>{
    expect(memory.reg8(reg8.B)).to.equal(192)
  })
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(true, memory)
  expectHalfCarryFlag(false, memory)
  expectNumberOfCycle(2, memory)
})

describe('SRA_mXY',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.H, 0)
  memory.setReg8(reg8.L, 2)
  memory.writeByte(0x0002, 129)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.SRA_mXY(reg8.H,reg8.L, memory)
  it('should rotate register XY to the left',()=>{
    expect(memory.readByte(0x0002)).to.equal(192)
  })
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(true, memory)
  expectHalfCarryFlag(false, memory)
  expectNumberOfCycle(4, memory)
})

describe('SWAP_X',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.B, 129)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.SWAP_X(reg8.B, memory)
  it('should swap register X',()=>{
    expect(memory.reg8(reg8.B)).to.equal(24)
  })
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(false, memory)
  expectHalfCarryFlag(false, memory)
  expectNumberOfCycle(2, memory)
})

describe('SWAP_mXY',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.H, 0)
  memory.setReg8(reg8.L, 2)
  memory.writeByte(0x0002, 129)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.SWAP_mXY(reg8.H,reg8.L, memory)
  it('should swap memory[XY]',()=>{
    expect(memory.readByte(0x0002)).to.equal(24)
  })
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(false, memory)
  expectHalfCarryFlag(false, memory)
  expectNumberOfCycle(4, memory)
})

describe('SRL_X',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.B, 129)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.SRL_X(reg8.B, memory)
  it('should rotate register X to the right',()=>{
    expect(memory.reg8(reg8.B)).to.equal(64)
  })
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(true, memory)
  expectHalfCarryFlag(false, memory)
  expectNumberOfCycle(2, memory)
})

describe('BIT_bit_X',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.B, 16)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.BIT_bit_X(4, reg8.B, memory)
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(false, memory)
  expectHalfCarryFlag(true, memory)
  expectNumberOfCycle(2, memory)
})

describe('BIT_bit_mXY',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.H, 0)
  memory.setReg8(reg8.L, 2)
  memory.writeByte(0x0002, 16)
  memory.setFlag(flags.zero, true)
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.carry, false)

  opcodes.BIT_bit_mXY(4, reg8.H,reg8.L, memory)
  expectZeroFlag(false, memory)
  expectSubtractFlag(false, memory)
  expectCarryFlag(false, memory)
  expectHalfCarryFlag(true, memory)
  expectNumberOfCycle(4, memory)
})

describe('RES_bit_X',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.B, 16)

  opcodes.RES_bit_X(4, reg8.B, memory)
  it('should set bit 4 in X to 0',()=>{
    expect(memory.reg8(reg8.B)).to.equal(0)
  })
  expectNumberOfCycle(2, memory)
})

describe('RES_bit_mXY',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.H, 0)
  memory.setReg8(reg8.L, 2)
  memory.writeByte(0x0002, 16)

  opcodes.RES_bit_mXY(4, reg8.H,reg8.L, memory)
  it('should set bit 4 in memory[XY] to 0',()=>{
    expect(memory.readByte(0x0002)).to.equal(0)
  })
  expectNumberOfCycle(4, memory)
})

describe('SET_bit_X',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.B, 0)

  opcodes.SET_bit_X(4, reg8.B, memory)
  it('should set bit 4 in X to 0',()=>{
    expect(memory.reg8(reg8.B)).to.equal(16)
  })
  expectNumberOfCycle(2, memory)
})

describe('SET_bit_mXY',()=>{
  const memory = Memory.createEmptyMemory()
  memory.setReg8(reg8.H, 0)
  memory.setReg8(reg8.L, 2)
  memory.writeByte(0x0002, 0)

  opcodes.SET_bit_mXY(4, reg8.H,reg8.L, memory)
  it('should set bit 4 in memory[XY] to 0',()=>{
    expect(memory.readByte(0x0002)).to.equal(16)
  })
  expectNumberOfCycle(4, memory)
})