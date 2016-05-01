import {flags} from './Memory'

export function RLC_X(regX, memory){
  memory.setFlag(flags.carry, (memory.reg8(regX) > 0x7F))
  memory.setReg8(regX,((memory.reg8(regX) << 1) & 0xFF) | (((memory.flag(flags.carry)) ? 1 : 0)))
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.zero, (memory.reg8(regX)) === 0)
  memory.setLastInstructionClock(2)
}

export function RLC_mXY(regX, regY, memory){
  const addr = memory.reg8(regX)<<8 | memory.reg8(regY)
  const tmp = memory.readByte(addr)
  memory.setFlag(flags.carry, (tmp > 0x7F))
  const val = (((tmp << 1) & 0xFF) | (((memory.flag(flags.carry)) ? 1 : 0)))
  memory.writeByte(addr, val)
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.zero, val === 0)
  memory.setLastInstructionClock(4)
}

export function RRC_X(regX, memory){
  memory.setFlag(flags.carry,(memory.reg8(regX) & 0x01) === 0x01)
  memory.setReg8(regX,(memory.flag(flags.carry) ? 0x80 : 0) | (memory.reg8(regX) >> 1))
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.zero, (memory.reg8(regX)) === 0)
  memory.setLastInstructionClock(2)
}

export function RRC_mXY(regX, regY, memory){
  const addr = memory.reg8(regX)<<8 | memory.reg8(regY)
  let tmp = memory.readByte(addr)
  memory.setFlag(flags.carry, ((tmp & 0x01) === 0x01))
  tmp = (((memory.flag(flags.carry)) ? 0x80 : 0) | (tmp >> 1))
  memory.writeByte(addr, tmp)
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.zero, tmp === 0)
  memory.setLastInstructionClock(4)
}

export function RL_X(regX, memory){
  const carry = (memory.reg8(regX) > 0x7F)
  memory.setReg8(regX, (((memory.reg8(regX)  << 1) & 0xFF) | ((memory.flag(flags.carry)) ? 1 : 0)))
  memory.setFlag(flags.carry, carry)
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.zero, (memory.reg8(regX)) === 0)
  memory.setLastInstructionClock(2)
}

export function RL_mXY(regX, regY, memory){
  const addr = memory.reg8(regX)<<8 | memory.reg8(regY)
  let tmp = memory.readByte(addr)
  const carry = (tmp > 0x7F)
  tmp = (((tmp << 1) & 0xFF) | ((memory.flag(flags.carry) ? 1 : 0)))
  memory.setFlag(flags.carry, carry)
  memory.writeByte(addr, tmp)
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.zero, tmp === 0)
  memory.setLastInstructionClock(4)
}

export function RR_X(regX, memory){
  const carry = ((memory.reg8(regX) & 0x01) == 0x01)
  memory.setReg8(regX,((memory.flag(flags.carry)  ? 0x80 : 0) | (memory.reg8(regX) >> 1)))
  memory.setFlag(flags.carry, carry)
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.zero, (memory.reg8(regX)) === 0)
  memory.setLastInstructionClock(2)
}

export function RR_mXY(regX, regY, memory){
  const addr = memory.reg8(regX)<<8 | memory.reg8(regY)
  let tmp = memory.readByte(addr)
  const carry = ((tmp & 0x01) === 0x01)
  tmp = ((memory.flag(flags.carry)  ? 0x80 : 0) | (tmp >> 1))
  memory.setFlag(flags.carry, carry)
  memory.writeByte(addr, tmp)
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.zero, tmp === 0)
  memory.setLastInstructionClock(4)
}

export function SLA_X(regX, memory){
  memory.setFlag(flags.carry, (memory.reg8(regX) > 0x7F))
  memory.setReg8(regX, (memory.reg8(regX) << 1))
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.zero, (memory.reg8(regX)) === 0)
  memory.setLastInstructionClock(2)
}

export function SLA_mXY(regX, regY, memory){
  const addr = (memory.reg8(regX)<<8) | memory.reg8(regY)
  let tmp = memory.readByte(addr)
  memory.setFlag(flags.carry, tmp > 0x7F)
  tmp = (tmp << 1) & 0xFF
  memory.writeByte(addr, tmp)
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.zero, tmp === 0)
  memory.setLastInstructionClock(4)
}

export function SRA_X(regX, memory){
  memory.setFlag(flags.carry,((memory.reg8(regX) & 0x01) === 0x01))
  memory.setReg8(regX, ((memory.reg8(regX) & 0x80) | (memory.reg8(regX) >> 1)))
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.zero, (memory.reg8(regX)) === 0)
  memory.setLastInstructionClock(2)
}

export function SRA_mXY(regX, regY, memory){
  const addr = memory.reg8(regX)<<8 | memory.reg8(regY)
  let tmp = memory.readByte(addr)
  memory.setFlag(flags.carry,((tmp & 0x01) === 0x01))
  tmp = (tmp & 0x80) | (tmp >> 1);
  memory.writeByte(addr, tmp)
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.zero, tmp === 0)
  memory.setLastInstructionClock(4)
}

export function SWAP_X(regX, memory){
  memory.setReg8(regX, ((memory.reg8(regX) & 0xF) << 4) | (memory.reg8(regX) >> 4))
  memory.setFlag(flags.zero, memory.reg8(regX) === 0)
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.carry, false)
  memory.setLastInstructionClock(2)
}

export function SWAP_mXY(regX, regY, memory){
  const addr = memory.reg8(regX)<<8 | memory.reg8(regY)
  let tmp = memory.readByte(addr)
  tmp = ((tmp & 0xF) << 4) | (tmp >> 4)
  memory.writeByte(addr, tmp)
  memory.setFlag(flags.zero, tmp === 0)
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.carry, false)
  memory.setLastInstructionClock(4)
}

export function SRL_X(regX, memory){
  memory.setFlag(flags.carry,((memory.reg8(regX) & 0x01) === 0x01))
  memory.setReg8(regX, (memory.reg8(regX) >> 1))
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.zero, memory.reg8(regX) === 0)
  memory.setLastInstructionClock(2)
}

export function SRL_mXY(regX, regY, memory){
  const addr = memory.reg8(regX)<<8 | memory.reg8(regY)
  let tmp = memory.readByte(addr)
  memory.setFlag(flags.carry,((tmp & 0x01) === 0x01))
  memory.writeByte(addr, tmp >> 1)
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.zero, (tmp < 2))
  memory.setLastInstructionClock(4)
}

export function BIT_bit_X(bit, regX, memory){
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.zero, ((memory.reg8(regX) & (0x01 << bit)) === 0))
  memory.setLastInstructionClock(2)
}

export function BIT_bit_mXY(bit, regX, regY, memory){
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.subtract, false)
  const addr = memory.reg8(regX)<<8 | memory.reg8(regY)
  let tmp = memory.readByte(addr)
  memory.setFlag(flags.zero, ((tmp & (0x01 << bit)) === 0))
  memory.setLastInstructionClock(4)
}

export function RES_bit_X(bit, regX, memory){
  memory.setReg8(regX, memory.reg8(regX) & ((0x01 << bit) ^ 0xFF))
  memory.setLastInstructionClock(2)
}

export function RES_bit_mXY(bit, regX, regY, memory){
  const addr = memory.reg8(regX)<<8 | memory.reg8(regY)
  const tmp = memory.readByte(addr)
  memory.writeByte(addr, tmp & ((0x01 << bit) ^ 0xFF))
  memory.setLastInstructionClock(4)
}

export function SET_bit_X(bit, regX, memory){
  memory.setReg8(regX, memory.reg8(regX) | (0x01 << bit))
  memory.setLastInstructionClock(2)
}

export function SET_bit_mXY(bit, regX, regY, memory){
  const addr = memory.reg8(regX)<<8 | memory.reg8(regY)
  const tmp = memory.readByte(addr)
  memory.writeByte(addr, tmp | (0x01 << bit))
  memory.setLastInstructionClock(4)
}
