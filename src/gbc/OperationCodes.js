import {flags} from './Memory'

export function NOP(memory){
  memory.setLastInstructionClock(1)
}

export function LD_XY_d16(regX, regY, memory){
  memory.setReg8(regY, memory.readByte(memory.PC()))
  memory.setReg8(regX, memory.readByte(memory.PC()+1))
  memory.setPC(memory.PC()+2)
  memory.setLastInstructionClock(3)
}

export function  LD_mXY_Z(regX, regY, regZ, memory) {
  memory.writeByte((memory.reg8(regX)<<8)+memory.reg8(regY), memory.reg8(regZ))
  memory.setLastInstructionClock(2)
}

export function INC_XY(regX, regY, memory){
  const tmp = (memory.reg8(regX)<<8) + memory.reg8(regY) + 1
  memory.setReg8(regX, (tmp<<8))
  memory.setReg8(regY, tmp)
  memory.setLastInstructionClock(2)
}

export function INC_X(regX, memory){
  memory.setReg8(regX, (memory.reg8(regX)+1))
  memory.setFlag(flags.zero, memory.reg8(regX) === 0)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.halfCarry, (memory.reg8(regX)&0xF) === 0)
  memory.setLastInstructionClock(1)
}

export function DEC_X(regX, memory){
  memory.setReg8(regX, (memory.reg8(regX)-1))
  memory.setFlag(flags.zero,memory.reg8(regX) === 0)
  memory.setFlag(flags.subtract,true)
  memory.setFlag(flags.halfCarry,(memory.reg8(regX)&0xF) === 0xF)
  memory.setLastInstructionClock(1)
}

export function LD_X_d8(regX, memory){
  memory.setReg8(regX, memory.readByte(memory.PC()))
  memory.setPC(memory.PC()+1)
  memory.setLastInstructionClock(2)
}

export function RLC_X(regX, memory){
  const ci = (memory.reg8(regX)&128)?1:0
  memory.setReg8(regX, (memory.reg8(regX) << 1)+ci)
  memory.setFlag(flags.zero,false)
  memory.setFlag(flags.subtract,false)
  memory.setFlag(flags.halfCarry,false)
  memory.setFlag(flags.carry,ci === 1)
  memory.setLastInstructionClock(1)
}

export function LD_a16_SP(memory){
  const addr = memory.readWord(memory.PC())
  memory.writeWord(addr, memory.SP())
  memory.setPC(memory.PC() + 2)
  memory.setLastInstructionClock(5)
}

export function ADD_XY_ZQ(regX, regY, regZ, regQ, memory){
  const XY = (memory.reg8(regX)<<8)+memory.reg8(regY)
  const ZQ = (memory.reg8(regZ)<<8)+memory.reg8(regQ)
  const rawSum = XY + ZQ

  memory.setReg8(regX, rawSum>>8)
  memory.setReg8(regY, rawSum)

  memory.setFlag(flags.subtract,false)
  memory.setFlag(flags.halfCarry,(XY&0xFFF) > (rawSum&0xFFF))
  memory.setFlag(flags.carry,rawSum > 0xFFFF)
  memory.setLastInstructionClock(2)
}

export function LD_X_mYZ(regX, regY, regZ, memory){
  const tmp = memory.readByte((memory.reg8(regY)<<8)+memory.reg8(regZ))
  memory.setReg8(regX, tmp)
  memory.setLastInstructionClock(2)
}

export function DEC_XY(regX, regY, memory){
  const tmp = ((memory.reg8(regX)<<8)+(memory.reg8(regY))-1)&0xFFFF
  memory.setReg8(regX, tmp>>8)
  memory.setReg8(regY, tmp)
  memory.setLastInstructionClock(2)
}

export function RRC_X(regX, memory){
  memory.setReg8(regX, (memory.reg8(regX)>>1) | ((memory.reg8(regX)&1)<<7))
  memory.setFlag(flags.zero,false)
  memory.setFlag(flags.subtract,false)
  memory.setFlag(flags.halfCarry,false)
  memory.setFlag(flags.carry,memory.reg8(regX) > 0x7F)
}

export function STOP(memory){
  memory.setFlag(flags.stop, true)
  memory.setLastInstructionClock(1)
}

export function RL_X(regX, memory){
  const cf = (memory.flag(flags.carry)?1:0)
  memory.setFlag(flags.carry,memory.reg8(regX) > 0x7F)
  memory.setReg8(regX, ((memory.reg8(regX) << 1) & 0xFF) | cf)
  memory.setFlag(flags.zero,false)
  memory.setFlag(flags.subtract,false)
  memory.setFlag(flags.halfCarry,false)
  memory.setLastInstructionClock(1)
}

export function JR_r8(memory){
  memory.setPC((memory.PC()) + ((memory.readByte(memory.PC()) << 24) >> 24) + 1)
  memory.setLastInstructionClock(3)
}

export function RR_X(regX, memory){
  var cf = (memory.flag(flags.carry)) ? 0x80 : 0
  memory.setFlag(flags.carry,(memory.reg8(regX) & 1) == 1)
  memory.setReg8(regX, (memory.reg8(regX) >> 1) | cf)
  memory.setFlag(flags.zero,false)
  memory.setFlag(flags.subtract,false)
  memory.setFlag(flags.halfCarry,false)
  memory.setLastInstructionClock(1)
}

export function JR_SF_r8(state, flag, memory){
  const check = state?memory.flag(flag):!memory.flag(flag)
  if (check) {
    memory.setPC (memory.PC() + ((memory.readByte(memory.PC()) << 24) >> 24) + 1)
    memory.setLastInstructionClock(3)
  }
  else {
    memory.setPC(memory.PC() + 1)
    memory.setLastInstructionClock(2)
  }
}

export function LD_N_mXY_Z(n, regX, regY, regZ, memory){
  const tmp = (memory.reg8(regX)<<8)+memory.reg8(regY)
  memory.writeByte(tmp, memory.reg8(regZ))
  const tmp2 = tmp + n
  memory.setReg8(regX, tmp2>>8)
  memory.setReg8(regY, tmp2)
  memory.setLastInstructionClock(2)
}

export function DAX(regX, memory){
  if (!memory.flag(flags.subtract)) {
    //                                            10011001
    if (memory.flag(flags.carry) || memory.reg8(regX) > 0x99) {
      //                                       1100000
      memory.setReg8(regX, memory.reg8(regX) + 0x60)
      memory.setFlag(flags.carry,true)
    }
    //                                                  1111    1001
    if (memory.flag(flags.halfCarry) || ((memory.reg8(regX) & 0xF)) > 0x9) {
      //                                       00000110
      memory.setReg8(regX, memory.reg8(regX) + 0x06)
      memory.setFlag(flags.halfCarry,false)
    }
  }
  else if (memory.flag(flags.carry) && memory.flag(flags.halfCarry)) {
    //                                       10011010
    memory.setReg8(regX, memory.reg8(regX) + 0x9A)
    memory.setFlag(flags.halfCarry,false)
  }
  else if (memory.flag(flags.carry)) {
    //                                         10100000
    memory.setReg8(regX, (memory.reg8(regX)) + 0xA0)
  }
  else if (memory.flag(flags.halfCarry)) {
    //                                       11111010
    memory.setReg8(regX, memory.reg8(regX) + 0xFA)
    memory.setFlag(flags.halfCarry,false)
  }
  memory.setFlag(flags.zero,memory.reg8(regX) === 0)
  memory.setLastInstructionClock(1)
}

export function LD_N_X_mYZ(n,regX, regY, regZ, memory){
  const tmp = (memory.reg8(regY)<<8)+memory.reg8(regZ)
  memory.setReg8(regX, memory.readByte(tmp))
  const tmp2 = tmp + n
  memory.setReg8(regY, tmp2>>8)
  memory.setReg8(regZ, tmp2)
  memory.setLastInstructionClock(2)
}

export function CPL_X(regX, memory){
  memory.setReg8(regX, (memory.reg8(regX) ^ 0xFF))
  memory.setFlag(flags.subtract,true)
  memory.setFlag(flags.halfCarry,true)
  memory.setLastInstructionClock(1)
}

export function INC_mXY(regX, regY, memory) {
  const addr = (memory.reg8(regX)<<8)+memory.reg8(regY)
  const tmp = (memory.readByte(addr) + 1)
  memory.setFlag(flags.zero, (tmp == 0))
  memory.setFlag(flags.halfCarry, (tmp & 0xF) === 0)
  memory.setFlag(flags.subtract, false)
  memory.writeByte(addr, tmp)
  memory.setLastInstructionClock(3)
}

export function DEC_mXY(regX, regY, memory) {
  const addr = (memory.reg8(regX)<<8)+memory.reg8(regY)
  const tmp = (memory.readByte(addr) - 1)
  memory.setFlag(flags.zero, (tmp == 0))
  memory.setFlag(flags.halfCarry,((tmp & 0xF) == 0xF))
  memory.setFlag(flags.subtract, true)
  memory.writeByte(addr, tmp)
  memory.setLastInstructionClock(3)
}

export function LD_mXY_d8(regX, regY, memory){
  const val = memory.readByte(memory.PC())
  const addr = (memory.reg8(regX)<<8)+memory.reg8(regY)
  memory.writeByte(addr, val)
  memory.setPC(memory.PC()+1)
  memory.setLastInstructionClock(3)
}

export function SCF(memory) {
  memory.setFlag(flags.carry, true)
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
}

export function CCF(memory) {
  memory.setFlag(flags.carry, !memory.flag(flags.carry))
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
}

export function LD_X_Y(regX, regY, memory){
  memory.setReg8(regX, memory.reg8(regY))
  memory.setLastInstructionClock(1)
}

export function HALT(memory){
  memory.setFlag(flags.halt, true)
  memory.setLastInstructionClock(1)
}

export function ADD_X_Y(regX, regY, memory){
  const sum = memory.reg8(regX) + memory.reg8(regY);
  memory.setFlag(flags.halfCarry, ((sum & 0xF) < (memory.reg8(regX)) & 0xF))
  memory.setFlag(flags.carry,(sum > 0xFF))
  memory.setReg8(regX, sum)
  memory.setFlag(flags.zero, (memory.reg8(regX) === 0))
  memory.setFlag(flags.subtract, false)
  memory.setLastInstructionClock(1)
}

export function ADD_X_mYZ(regX, regY, regZ, memory){
  const addr = (memory.reg8(regY)<<8)+memory.reg8(regZ)
  const sum = memory.reg8(regX) + memory.readByte(addr)
  memory.setFlag(flags.halfCarry, (sum & 0xF) < (memory.reg8(regX) & 0xF))
  memory.setFlag(flags.carry,(sum > 0xFF))
  memory.setReg8(regX, sum)
  memory.setFlag(flags.zero, (memory.reg8(regX) === 0))
  memory.setFlag(flags.subtract, false)
  memory.setLastInstructionClock(2)
}

export function ADC_X_Y(regX, regY, memory){
  const sum = memory.reg8(regX) + memory.reg8(regY) + (memory.flag(flags.carry)? 1 : 0)
  memory.setFlag(flags.halfCarry, ((memory.reg8(regX) & 0xF) + (memory.reg8(regY) & 0xF) + (memory.flag(flags.carry)? 1 : 0) > 0xF))
  memory.setFlag(flags.carry,(sum > 0xFF))
  memory.setReg8(regX, sum)
  memory.setFlag(flags.zero, (memory.reg8(regX) === 0))
  memory.setFlag(flags.subtract, false)
  memory.setLastInstructionClock(1)
}

export function ADC_X_mYZ(regX, regY, regZ, memory){
  const addr = (memory.reg8(regY)<<8)+memory.reg8(regZ)
  const sum = memory.reg8(regX) + memory.readByte(addr) + (memory.flag(flags.carry)? 1 : 0)
  memory.setFlag(flags.halfCarry, ((memory.reg8(regX) & 0xF) + memory.readByte(addr) + (memory.flag(flags.carry)? 1 : 0) > 0xF))
  memory.setFlag(flags.carry,(sum > 0xFF))
  memory.setReg8(regX, sum)
  memory.setFlag(flags.zero, (memory.reg8(regX) === 0))
  memory.setFlag(flags.subtract, false)
  memory.setLastInstructionClock(2)
}

export function SUB_X_Y(regX, regY, memory){
  const sum = memory.reg8(regX) - memory.reg8(regY)
  memory.setFlag(flags.halfCarry, (memory.reg8(regX) & 0xF) < (sum & 0xF))
  memory.setFlag(flags.carry,(sum < 0))
  memory.setReg8(regX, sum)
  memory.setFlag(flags.zero, (sum === 0))
  memory.setFlag(flags.subtract, true)
  memory.setLastInstructionClock(1)
}

export function SUB_X_mYZ(regX, regY, regZ, memory){
  const addr = (memory.reg8(regY)<<8)+memory.reg8(regZ)
  const sum = memory.reg8(regX) - memory.readByte(addr)
  memory.setFlag(flags.halfCarry, (memory.reg8(regX) & 0xF) < (sum & 0xF))
  memory.setFlag(flags.carry,(sum < 0))
  memory.setReg8(regX, sum)
  memory.setFlag(flags.zero, (sum === 0))
  memory.setFlag(flags.subtract, true)
  memory.setLastInstructionClock(2)
}

export function SBC_X_Y(regX, regY, memory){
  const sum = memory.reg8(regX) - memory.reg8(regY) - ((memory.flag(flags.carry)) ? 1 : 0)
  memory.setFlag(flags.halfCarry, ((memory.reg8(regX) & 0xF) - (memory.reg8(regY) & 0xF) - (memory.flag(flags.carry)? 1 : 0) > 0xF) < 0)
  memory.setFlag(flags.carry,(sum < 0))
  memory.setReg8(regX, sum)
  memory.setFlag(flags.zero, (sum === 0))
  memory.setFlag(flags.subtract, true)
  memory.setLastInstructionClock(1)
}

export function SBC_X_mYZ(regX, regY, regZ, memory){
  const addr = (memory.reg8(regY)<<8)+memory.reg8(regZ)
  const sum = memory.reg8(regX) - memory.readByte(addr) - ((memory.flag(flags.carry)) ? 1 : 0)
  memory.setFlag(flags.halfCarry, ((memory.reg8(regX) & 0xF) - (memory.reg8(regY) & 0xF) - (memory.flag(flags.carry)? 1 : 0) > 0xF) < 0)
  memory.setFlag(flags.carry,(sum < 0))
  memory.setReg8(regX, sum)
  memory.setFlag(flags.zero, (sum === 0))
  memory.setFlag(flags.subtract, true)
  memory.setLastInstructionClock(2)
}

export function AND_X_Y(regX, regY, memory){
  memory.setReg8(regX, memory.reg8(regX) & memory.reg8(regY))
  memory.setFlag(flags.zero, (memory.reg8(regX) === 0))
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.carry,false)
  memory.setLastInstructionClock(1)
}

export function AND_X_mYZ(regX, regY, regZ, memory){
  const addr = (memory.reg8(regY)<<8)+memory.reg8(regZ)
  memory.setReg8(regX, memory.reg8(regX) & memory.readByte(addr))
  memory.setFlag(flags.zero, (memory.reg8(regX) === 0))
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.carry,false)
  memory.setLastInstructionClock(2)
}

export function XOR_X_Y(regX, regY, memory){
  memory.setReg8(regX, memory.reg8(regX) ^ memory.reg8(regY))
  memory.setFlag(flags.zero, (memory.reg8(regX) === 0))
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.carry,false)
  memory.setLastInstructionClock(1)
}

export function XOR_X_mYZ(regX, regY, regZ, memory){
  const addr = (memory.reg8(regY)<<8)+memory.reg8(regZ)
  memory.setReg8(regX, memory.reg8(regX) ^ memory.readByte(addr))
  memory.setFlag(flags.zero, (memory.reg8(regX) === 0))
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.carry,false)
  memory.setLastInstructionClock(2)
}

export function OR_X_Y(regX, regY, memory){
  memory.setReg8(regX, memory.reg8(regX) | memory.reg8(regY))
  memory.setFlag(flags.zero, (memory.reg8(regX) === 0))
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.carry,false)
  memory.setLastInstructionClock(1)
}

export function OR_X_mYZ(regX, regY, regZ, memory){
  const addr = (memory.reg8(regY)<<8)+memory.reg8(regZ)
  memory.setReg8(regX, memory.reg8(regX) | memory.readByte(addr))
  memory.setFlag(flags.zero, (memory.reg8(regX) === 0))
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.carry,false)
  memory.setLastInstructionClock(2)
}

export function CP_X_Y(regX, regY, memory){
  const tmp = memory.reg8(regX) - memory.reg8(regY)
  memory.setFlag(flags.zero, (memory.reg8(regX) === 0))
  memory.setFlag(flags.halfCarry, (tmp &0xF) > (memory.reg8(regX) & 0xF))
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.carry,tmp < 0)
  memory.setLastInstructionClock(1)
}

export function CP_X_mYZ(regX, regY, regZ, memory){
  const addr = (memory.reg8(regY)<<8)+memory.reg8(regZ)
  const tmp = memory.reg8(regX) - memory.readByte(addr)
  memory.setFlag(flags.zero, (memory.reg8(regX) === 0))
  memory.setFlag(flags.halfCarry, (tmp &0xF) > (memory.reg8(regX) & 0xF))
  memory.setFlag(flags.subtract, true)
  memory.setFlag(flags.carry,tmp < 0)
  memory.setLastInstructionClock(2)
}

export function RET_S_F(state, flag, memory){
  const check = state?memory.flag(flag):!memory.flag(flag)
  if(check){
    memory.setPC(memory.readWord(memory.SP()))
    memory.setSP(memory.SP()+2)
    memory.setLastInstructionClock(5)
  } else {
    memory.setLastInstructionClock(2)
  }
}

export function POP_X_Y(regX, regY, memory){
  memory.setReg8(regY, memory.readByte(memory.SP()))
  memory.setReg8(regX, memory.readByte(memory.SP()+1))
  memory.setSP(memory.SP()+2)
  memory.setLastInstructionClock(3)
}

export function JP_S_F_a16(state, flag, memory){
  const check = state?memory.flag(flag):!memory.flag(flag)
  if(check){
    memory.setPC(memory.readWord(memory.PC()))
    memory.setLastInstructionClock(4)
  } else {
    memory.setLastInstructionClock(3)
  }
}

export function JP_a16(memory){
  memory.setPC(memory.readWord(memory.PC()))
  memory.setLastInstructionClock(3)
}

export function CALL_S_F_a16(state, flag, memory){
  const check = state?memory.flag(flag):!memory.flag(flag)
  if (check) {
    const tmppc = memory.readWord(memory.PC())
    memory.setPC(memory.PC() + 2)
    memory.setSP(memory.SP() - 1)
    memory.writeByte(memory.SP(), memory.PC() >> 8)
    memory.setSP(memory.SP() - 1)
    memory.writeByte(memory.SP(), memory.PC())
    memory.setPC(tmppc)
    memory.setLastInstructionClock(6)
  }
  else {
    memory.setPC(memory.PC() + 2)
    memory.setLastInstructionClock(2)
  }
}

export function PUSH_X_Y(regX, regY, memory){
  memory.setSP(memory.SP() - 1)
  memory.writeByte(memory.SP(), memory.reg8(regX))
  memory.setSP(memory.SP() - 1)
  memory.writeByte(memory.SP(), memory.reg8(regY))
  memory.setLastInstructionClock(4)
}

export function ADD_X_d8(regX, memory){
  const sum = memory.reg8(regX) + memory.readByte(memory.PC())
  memory.setPC(memory.PC() + 1)
  memory.setFlag(flags.halfCarry, (sum & 0xF) < (memory.reg8(regX) & 0xF))
  memory.setFlag(flags.carry, (sum > 0xFF))
  memory.setReg8(regX, sum)
  memory.setFlag(flags.zero, (memory.reg8(regX) === 0))
  memory.setFlag(flags.subtract, false)
  memory.setLastInstructionClock(2)
}

export function RST_p(p,memory){
  memory.setSP(memory.SP() - 1)
  memory.writeByte(memory.SP(), memory.PC() >> 8)
  memory.setSP(memory.SP() - 1)
  memory.writeByte(memory.SP(), memory.PC())
  memory.setPC(p)
  memory.setLastInstructionClock(4)
}

export function RET(memory){
  memory.setPC((memory.readByte((memory.SP() + 1) & 0xFFFF) << 8) | memory.readByte(memory.SP()))
  memory.setSP(memory.SP() + 2)
  memory.setLastInstructionClock(4)
}

export function PREFIX_CB(prefixedOpcodes, memory){
  const opcode = memory.readByte(memory.PC())
  memory.setPC(memory.PC() + 1)
  prefixedOpcodes[opcode](memory)
  memory.setLastInstructionClock(memory.lastInstructionClock() + 1)
}

export function CALL_a16(memory){
  const tmppc = memory.readWord(memory.PC())
  memory.setPC(memory.PC() + 2)
  memory.setSP(memory.SP() - 1)
  memory.writeByte(memory.SP(), memory.PC() >> 8)
  memory.setSP(memory.SP() - 1)
  memory.writeByte(memory.SP(), memory.PC())
  memory.setPC(tmppc)
  memory.setLastInstructionClock(6)
}

export function ADC_X_d8(regX, memory){
  const tmp = memory.readByte(memory.PC())
  memory.setPC(memory.PC() + 1)
  const sum = memory.reg8(regX) + tmp + ((memory.flag(flags.carry)) ? 1 : 0)
  memory.setFlag(flags.halfCarry, ((memory.reg8(regX) & 0xF) + (tmp & 0xF) + ((memory.flag(flags.carry)) ? 1 : 0)) > 0xF)
  memory.setFlag(flags.carry, (sum > 0xFF))
  memory.setReg8(regX, sum)
  memory.setFlag(flags.zero, memory.reg8(regX) === 0)
  memory.setFlag(flags.subtract, false)
  memory.setLastInstructionClock(2)
}

export function ILLEGAL(memory){
  memory.setFlag(flags.stop, true)
  memory.setFlag(flags.illegal, true)
}

export function SUB_X_d8(regX, memory){
  const sum = memory.reg8(regX) - memory.readByte(memory.PC())
  memory.setPC((memory.PC()) + 1)
  memory.setFlag(flags.halfCarry, (memory.reg8(regX) & 0xF) < (sum & 0xF))
  memory.setFlag(flags.carry, sum < 0)
  memory.setReg8(regX, sum)
  memory.setFlag(flags.zero, sum === 0)
  memory.setFlag(flags.subtract, true)
  memory.setLastInstructionClock(2)
}

export function RETI(memory){
  memory.setPC((memory.readByte((memory.SP() + 1) & 0xFFFF) << 8) | memory.readByte(memory.SP()))
  memory.setSP(memory.SP() + 2)
  memory.setIRQEnableDelay((memory.IRQEnableDelay() === 2 || memory.readByte(memory.PC()) === 0x76) ? 1 : 2)
  memory.setLastInstructionClock(4)
}

export function SBC_X_d8(regX, memory){
  const tmp = memory.readByte(memory.PC())
  memory.setPC(memory.PC() + 1)
  const sum = memory.reg8(regX) - tmp - ((memory.flag(flags.carry)) ? 1 : 0)
  memory.setFlag(flags.halfCarry, (memory.reg8(regX) & 0xF) - (tmp & 0xF) - ((memory.flag(flags.carry)) ? 1 : 0) < 0)
  memory.setFlag(flags.carry, sum < 0)
  memory.setReg8(regX, sum)
  memory.setFlag(flags.zero, (memory.reg8(regX) === 0))
  memory.setFlag(flags.subtract, true)
  memory.setLastInstructionClock(2)
}

export function LDH_ma8_X(regX, memory){
  memory.writeByte(0xFF00+memory.readByte(memory.PC()),memory.reg8(regX))
  memory.setPC(memory.PC() + 1)
  memory.setLastInstructionClock(3)
}

export function LD_mX_Y(regX, regY, memory){
  memory.writeByte(0xFF00+memory.reg8(regX),memory.reg8(regY))
  memory.setLastInstructionClock(2)
}

export function AND_X_d8(regX, memory){
  memory.reg8(regX, memory.reg8(regX) & memory.readByte(memory.PC()))
  memory.setPC(memory.PC() + 1)
  memory.setFlag(flags.zero, (memory.reg8(regX)) === 0)
  memory.setFlag(flags.halfCarry, true)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.carry, false)
  memory.setLastInstructionClock(2)
}

export function ADD_SP_r8(memory){
  let tmp2 = ((memory.readByte(memory.PC()) << 24) >> 24)
  memory.setPC(memory.PC() + 1)
  const tmp = (memory.SP() + tmp2)
  tmp2 = memory.SP() ^ tmp2 ^ tmp
  memory.setSP(tmp)
  memory.setFlag(flags.carry, (tmp2 & 0x100) === 0x100)
  memory.setFlag(flags.halfCarry, (tmp2 & 0x10) === 0x10)
  memory.setFlag(flags.zero, false)
  memory.setFlag(flags.subtract, false)
  memory.setLastInstructionClock(4)
}

export function JP_mXY(regX, regY, memory){
  memory.setPC((memory.reg8(regX)<<8)+memory.reg8(regY))
  memory.setLastInstructionClock(1)
}

export function LD_ma16_X(regX, memory){
  memory.writeByte((memory.readByte((memory.PC() + 1) & 0xFFFF) << 8) | memory.readByte(memory.PC()), memory.reg8(regX))
  memory.setPC(memory.PC() + 2)
  memory.setLastInstructionClock(4)
}

export function XOR_X_d8(regX, memory){
  memory.setReg8(regX, memory.reg8(regX) ^ memory.readByte(memory.PC()))
  memory.setPC(memory.PC() + 1)
  memory.setFlag(flags.zero, memory.reg8(regX) === 0)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.carry, false)
  memory.setLastInstructionClock(2)
}

export function LDH_X_ma8(regX, memory) {
  memory.setReg8(regX, memory.readByte(0xFF00+memory.readByte(memory.PC())))
  memory.setPC(memory.PC() + 1)
  memory.setLastInstructionClock(3)
}

export function LD_X_mY(regX, regY, memory){
  memory.setReg8(regX, memory.readByte(0xFF00+memory.reg8(regY)))
  memory.setLastInstructionClock(2)
}

export function DI(memory){
  memory.setFlag(flags.ime, false)
  memory.setIRQEnableDelay(0)
  memory.setLastInstructionClock(1)
}

export function OR_X_d8(regX, memory){
  memory.setReg8(regX, memory.reg8(regX) | memory.readByte(memory.PC()))
  memory.setFlag(flags.zero, memory.reg8(regX) === 0)
  memory.setPC(memory.PC() + 1)
  memory.setFlag(flags.subtract, false)
  memory.setFlag(flags.halfCarry, false)
  memory.setFlag(flags.carry, false)
  memory.setLastInstructionClock(2)
}

export function LD_XY_SP_r8(regX, regY, memory){
  let tmp = ((memory.readByte(memory.PC()) << 24) >> 24)
  memory.setPC(memory.PC() + 1)
  const tmp2 = (memory.SP() + tmp)
  memory.setReg8(regX, tmp2>>8)
  memory.setReg8(regY, tmp2)
  tmp = memory.SP() ^ tmp ^ tmp2
  memory.setFlag(flags.carry, ((tmp & 0x100) == 0x100))
  memory.setFlag(flags.halfCarry, ((tmp & 0x10) == 0x10))
  memory.setFlag(flags.zero, false)
  memory.setFlag(flags.subtract,  false)
  memory.setLastInstructionClock(3)
}

export function LD_SP_XY(regX, regY, memory){
  memory.setSP((memory.reg8(regX)<<8)+memory.reg8(regY))
  memory.setLastInstructionClock(2)
}

export function LD_X_ma16(regX, memory){
  memory.setReg8( regX, memory.readByte((memory.readByte((memory.PC() + 1) & 0xFFFF) << 8) | memory.readByte(memory.PC())))
  memory.setPC(memory.PC() + 2)
  memory.setLastInstructionClock(4)
}

export function EI(memory){
  memory.setIRQEnableDelay((memory.IRQEnableDelay() === 2 || memory.readByte(memory.PC()) === 0x76) ? 1 : 2)
  memory.setLastInstructionClock(1)
}

export function CP_X_d8(regX, memory){
  const sum = memory.reg8(regX) - memory.readByte(memory.PC())
  memory.setPC(memory.PC() + 1)
  memory.setFlag(flags.halfCarry, ((sum & 0xF) > (memory.reg8(regX) & 0xF)))
  memory.setFlag(flags.carry, (sum < 0))
  memory.setFlag(flags.zero, (sum === 0))
  memory.setFlag(flags.subtract, true)
  memory.setLastInstructionClock(2)
}
