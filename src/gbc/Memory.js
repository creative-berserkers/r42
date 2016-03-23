/*

Memory contains 65,536 bytes addressable from 00000 to 0FFFF

Registers are located at addresses from 10000 up

register A : 10000 to 10000
register B : 10001 to 10001
register C : 10002 to 10002
register D : 10003 to 10003
register E : 10004 to 10004
register H : 10005 to 10005
register L : 10006 to 10006
register F : 10007 to 10007

register PC: 10008 to 10009
register SP: 1000A to 1000B

last instr clock: 1000C to 1000C

clock : 1000D to 10010

stop flag: 10011
 */

const expectedBufferSize = 0x10012

export const reg8 = {
  A : 0x10000,
  B : 0x10001,
  C : 0x10002,
  D : 0x10003,
  E : 0x10004,
  H : 0x10005,
  L : 0x10006,
  F : 0x10007,
  S : 0x10008,
  P : 0x10009
}

export const flags = {
  zero : [reg8.F, 0x80],
  subtract: [reg8.F, 0x40],
  halfCarry: [reg8.F, 0x20],
  carry: [reg8.F, 0x10]
}

const SPMapping = 0x00008
const PCMapping = 0x0000A

const lastInstructionClockMapping = 0x1000C
const clockMapping = 0x1000D

const stopMapping = 0x10011

function createMemory(buffer){
  if(buffer.byteLength != expectedBufferSize){
    throw new Error('Memory must have size equal to 0x10010 bytes')
  }

  const byteView = new Uint8Array(buffer, 0, buffer.byteLength)

  return {
    readByte(addr){
      return byteView[addr]
    },
    writeByte(addr, value){
      byteView[addr] = value
    },
    readWord(addr){
      return (byteView[addr]<<8) + byteView[addr+1]
    },
    writeWord(addr, value){
      byteView[addr] = value>>8
      byteView[addr+1]=value
    },
    reg8(addr){
      return byteView[addr]
    },
    setReg8(addr, value){
      byteView[addr] = value
    },
    PC(){
      return (byteView[PCMapping]<<8)+byteView[PCMapping+1]
    },
    setPC(value){
      byteView[PCMapping] = (value>>8)
      byteView[PCMapping+1] = value
    },
    SP(){
      return (byteView[SPMapping]<<8)+byteView[SPMapping+1]
    },
    setSP(value){
      byteView[SPMapping] = (value>>8)
      byteView[SPMapping+1] = value
    },
    clock(){
      return (byteView[clockMapping]*16777216)+
        (byteView[clockMapping+1]*65536)+
        (byteView[clockMapping+2]*256)+
        (byteView[clockMapping+3])
    },
    setClock(value){
      byteView[clockMapping] = (value>>24)
      byteView[clockMapping+1] = (value>>16)
      byteView[clockMapping+2] = (value>>8)
      byteView[clockMapping+3] = (value)
    },
    lastInstructionClock(){
      return byteView[lastInstructionClockMapping]
    },
    setLastInstructionClock(value){
      byteView[lastInstructionClockMapping] = value
    },
    flag(flag){
      return (byteView[flag[0]] & flag[1]) !== 0
    },
    setFlag(flag, state){
      if(state){
        byteView[flag[0]] = byteView[flag[0]] | flag[1]
      } else {
        byteView[flag[0]] = byteView[flag[0]] & ~flag[1]
      }
    },
    stopFlag(){
      return byteView[stopMapping] === 1
    },
    setStopFlag(flag){
      if(flag){
        byteView[stopMapping] = 1
      } else {
        byteView[stopMapping] = 0
      }
    }
  }
}

export default {
  expectedBufferSize,
  createMemory,
  createEmptyMemory(){
    return createMemory(new ArrayBuffer(expectedBufferSize))
  }
}