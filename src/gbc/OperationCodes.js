export function NOP(memory){
  memory.setLastInstructionClock(1)
}

export function LD_XY_d16(regX, regY, memory){
  memory.setReg8(regY, memory.readByte(memory.PC()))
  memory.setReg8(regX, memory.readByte(memory.PC()+1))
  memory.setPC(memory.PC()+2)
  memory.setLastInstructionClock(3)
}

export function  LD_XY_Z(regX, regY, regZ, memory) {
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
  memory.setZeroFlag(memory.reg8(regX) === 0)
  memory.setSubtractFlag(false)
  memory.setHalfCarryFlag((memory.reg8(regX)&0xF) === 0)
  memory.setLastInstructionClock(1)
}

export function DEC_X(regX, memory){
  memory.setReg8(regX, (memory.reg8(regX)-1))
  memory.setZeroFlag(memory.reg8(regX) === 0)
  memory.setSubtractFlag(true)
  memory.setHalfCarryFlag((memory.reg8(regX)&0xF) === 0xF)
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
  memory.setZeroFlag(false)
  memory.setSubtractFlag(false)
  memory.setHalfCarryFlag(false)
  memory.setCarryFlag(ci === 1)
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

  memory.setSubtractFlag(false)
  memory.setHalfCarryFlag((XY&0xFFF) > (rawSum&0xFFF))
  memory.setCarryFlag(rawSum > 0xFFFF)
  memory.setLastInstructionClock(2)
}

export function LD_X_YZ(regX, regY, regZ, memory){
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
  memory.setZeroFlag(false)
  memory.setSubtractFlag(false)
  memory.setHalfCarryFlag(false)
  memory.setCarryFlag(memory.reg8(regX) > 0x7F)
}

export function STOP(memory){
  memory.setStopFlag(true)
  memory.setLastInstructionClock(1)
}

export function RL_X(regX, memory){
  const cf = (memory.carryFlag())?1:0
  memory.setCarryFlag(memory.reg8(regX) > 0x7F)
  memory.setReg8(regX, ((memory.reg8(regX) << 1) & 0xFF) | cf)
  memory.setZeroFlag(false)
  memory.setSubtractFlag(false)
  memory.setHalfCarryFlag(false)
  memory.setLastInstructionClock(1)
}

export function JR_r8(memory){
  memory.setPC((memory.PC()) + ((memory.readByte(memory.PC()) << 24) >> 24) + 1)
  memory.setLastInstructionClock(3)
}

export function RR_X(regX, memory){
  var cf = (memory.carryFlag()) ? 0x80 : 0
  memory.setCarryFlag((memory.reg8(regX) & 1) == 1)
  memory.setReg8(regX, (memory.reg8(regX) >> 1) | cf)
  memory.setZeroFlag(false)
  memory.setSubtractFlag(false)
  memory.setHalfCarryFlag(false)
  memory.setLastInstructionClock(1)
}

export function JR_NZ_r8(memory){
  if (!memory.zeroFlag()) {
    memory.setPC (memory.PC() + ((memory.readByte(memory.PC()) << 24) >> 24) + 1)
    memory.setLastInstructionClock(3)
  }
  else {
    memory.setPC(memory.PC() + 1)
    memory.setLastInstructionClock(2)
  }
}

export function LDI_XY_Z(regX, regY, regZ, memory){
  const tmp = (memory.reg8(regX)<<8)+memory.reg8(regY)
  memory.writeByte(tmp, memory.reg8(regZ))
  const tmp2 = tmp + 1
  memory.setReg8(regX, tmp2<<8)
  memory.setReg8(regY, tmp2)
  memory.setLastInstructionClock(2)
}

export function DAX(regX, memory){
  if (!memory.subtractFlag()) {
    //                                            10011001
    if (memory.carryFlag() || memory.reg8(regX) > 0x99) {
      //                                       1100000
      memory.setReg8(regX, memory.reg8(regX) + 0x60)
      memory.setCarryFlag(true)
    }
    //                                                  1111    1001
    if (memory.halfCarryFlag() || ((memory.reg8(regX) & 0xF)) > 0x9) {
      //                                       00000110
      memory.setReg8(regX, memory.reg8(regX) + 0x06)
      memory.setHalfCarryFlag(false)
    }
  }
  else if (memory.carryFlag() && memory.halfCarryFlag()) {
    //                                       10011010
    memory.setReg8(regX, memory.reg8(regX) + 0x9A)
    memory.setHalfCarryFlag(false)
  }
  else if (memory.carryFlag()) {
    //                                         10100000
    memory.setReg8(regX, (memory.reg8(regX)) + 0xA0)
  }
  else if (memory.halfCarryFlag()) {
    //                                       11111010
    memory.setReg8(regX, memory.reg8(regX) + 0xFA)
    memory.setHalfCarryFlag(false)
  }
  memory.setZeroFlag(memory.reg8(regX) === 0)
  memory.setLastInstructionClock(1)
}

export function JR_Z_r8(memory){
  if (memory.zeroFlag()) {
    memory.setPC(memory.PC() + ((memory.readByte(memory.PC()) << 24) >> 24) + 1)
    memory.setLastInstructionClock(3)
  }
  else {
    memory.setPC(memory.PC() + 1)
    memory.setLastInstructionClock(2)
  }
}

export function LDI_X_YZ(regX, regY, regZ, memory){
  const tmp = (memory.reg8(regY)<<8)+memory.reg8(regZ)
  memory.setReg8(regX, memory.readByte(tmp))
  const tmp2 = tmp + 1
  memory.setReg8(regY, tmp2<<8)
  memory.setReg8(regZ, tmp2)
  memory.setLastInstructionClock(2)
}

export function CPL(){
  
}