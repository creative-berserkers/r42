/*

Memory contains 65,536 bytes addressable from 00000 to 0FFFF

Registers are located at addresses from 10000 up

register A : 18000 to 18000
register B : 18001 to 18001
register C : 18002 to 18002
register D : 18003 to 18003
register E : 18004 to 18004
register H : 18005 to 18005
register L : 18006 to 18006
register F : 18007 to 18007

register PC: 18008 to 18009
register SP: 1800A to 1800B

last instr clock: 1800C to 1800C

clock : 1800D to 18010

stop flag: 18011
 */

const expectedBufferSize = 0x10046
const tilesetBufferSize = 0x8000
const screenBufferSize = 0x16800

export const reg8 = {
  A : [0x10000,'A'],
  B : [0x10001,'B'],
  C : [0x10002,'C'],
  D : [0x10003,'D'],
  E : [0x10004,'E'],
  H : [0x10005,'H'],
  L : [0x10006,'L'],
  F : [0x10007,'F'],
  S : [0x10008,'S'],
  P : [0x10009,'P']
}

export const flags = {
  zero : [reg8.F[0], 0x80],
  subtract: [reg8.F[0], 0x40],
  halfCarry: [reg8.F[0], 0x20],
  carry: [reg8.F[0], 0x10],
  stop: [0x10011,0x80],
  halt: [0x10011, 0x40],
  illegal: [0x10011, 0x20],
  ime: [0x10011, 0x10],
  isOutOfBios:[0x10011, 0x08],

  switchbg:[0x10022, 0x80],
  bgmap:[0x10022, 0x40],
  bgtile:[0x10022, 0x20],
  switchlcd:[0x10022, 0x10]
}

const SPMapping = 0x10008
const PCMapping = 0x1000A
const HLMapping = 0x10005

const lastInstructionClockMapping = 0x1000C
const clockMapping = 0x1000D

const IRQEnableDelayMapping = 0x10012

const gpuClockMapping = 0x10013
const gpuModeMapping = 0x10017
const gpuLineMapping = 0x10018
const gpuScrollXMapping = 0x10019
const gpuScrollYMapping = 0x10020
const gpuBGTileMapping = 0x10021
const gpuPalleteMapping = 0x10030

function createMemory(canvas, buffer, tilesetBuffer, screenBuffer){
  if(buffer.byteLength != expectedBufferSize){
    throw new Error('Memory must have size equal to 0x10010 bytes')
  }

  const byteView = new Uint8Array(buffer, 0, buffer.byteLength)
  const tilesetByteView = new Uint8Array(tilesetBuffer, 0, tilesetBuffer.byteLength)
  const screenByteView = screenBuffer

  function copyImageData(ctx, src){
      var dst = ctx.createImageData(src.width, src.height);
      dst.data.set(src.data);
      return dst;
  }

  return {
    clone(){
        return createMemory(canvas, buffer.slice(0), tilesetBuffer.slice(0), copyImageData(canvas, screenByteView));
    },
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
      byteView[addr] = (value>>8)
      byteView[addr+1]=value
    },
    reg8(addr){
      return byteView[addr[0]]
    },
    setReg8(addr, value){
      byteView[addr[0]] = value
    },
    PC(){
      return (byteView[PCMapping]<<8)+byteView[PCMapping+1]
    },
    setPC(value){
      byteView[PCMapping] = (value>>8)
      byteView[PCMapping+1] = value
    },
    SP(){
      return (byteView[SPMapping]<< 8)+byteView[SPMapping+1]
    },
    setSP(value){
      byteView[SPMapping] = (value>>8)
      byteView[SPMapping+1] = value
    },
    HL(){
      return (byteView[HLMapping]<< 8) + byteView[HLMapping+1]
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
    GPUClock(){
        return (byteView[gpuClockMapping]*16777216)+
          (byteView[gpuClockMapping+1]*65536)+
          (byteView[gpuClockMapping+2]*256)+
          (byteView[gpuClockMapping+3])
    },
    setGPUClock(value){
        byteView[gpuClockMapping] = (value>>24)
        byteView[gpuClockMapping+1] = (value>>16)
        byteView[gpuClockMapping+2] = (value>>8)
        byteView[gpuClockMapping+3] = (value)
    },
    lastInstructionClock(){
      return byteView[lastInstructionClockMapping]
    },
    setLastInstructionClock(value){
      byteView[lastInstructionClockMapping] = value
    },
    GPUMode(){
      return byteView[gpuModeMapping]
    },
    setGPUMode(mode){
      byteView[gpuModeMapping] = mode
    },
    GPULine(){
      return byteView[gpuLineMapping]
    },
    setGPULine(line){
      byteView[gpuLineMapping] = line
    },
    GPUScrollX(){
      return byteView[gpuScrollXMapping]
    },
    setGPUScrollX(value){
      byteView[gpuScrollXMapping] = value
    },
    GPUScrollY(){
      return byteView[gpuScrollYMapping]
    },
    setGPUScrollY(value){
      byteView[gpuScrollYMapping] = value
    },
    GPUPallete(index){
      return [byteView[gpuPalleteMapping+(index*4)],
              byteView[gpuPalleteMapping+(index*4)+1],
              byteView[gpuPalleteMapping+(index*4)+2],
              byteView[gpuPalleteMapping+(index*4)+3]]
    },
    setGPUPallete(index, value){
      byteView[gpuPalleteMapping+(index*4)] = value[0]
      byteView[gpuPalleteMapping+(index*4)+1] = value[1]
      byteView[gpuPalleteMapping+(index*4)+2] = value[2]
      byteView[gpuPalleteMapping+(index*4)+3] = value[3]
    },
    IRQEnableDelay(){
      return byteView[IRQEnableDelayMapping]
    },
    setIRQEnableDelay(value){
      byteView[IRQEnableDelayMapping] = value
    },
    tilesetData(tile, x, y){
      return tilesetByteView[(tile*64)+(y*8)+x]
    },
    setTilesetData(tile, x, y, val){
      tilesetByteView[(tile*64)+(y*8)+x] = val
    },
    screenData(index){
      return screenByteView.data[index]
    },
    setScreenData(index, value){
      screenByteView.data[index] = value
    },
    screenDataObj(){
      return screenByteView
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
    loadROM(data){
      console.log('loading ',data.byteLength, 'bytes')
      for(let i=0;i<data.byteLength;++i){
        byteView[i] = data[i]
      }

      for(let i=0; i<512; ++i){
        for(let y=0;y <8 ; y++){
          for(let x=0; x < 8; x++){
            tilesetByteView[(i*64)+(y*8)+x] = 255
          }
        }
      }
    }
  }
}

export default {
  expectedBufferSize,
  createMemory,
  createEmptyMemory(canvas){
    return createMemory(canvas, new ArrayBuffer(expectedBufferSize),new ArrayBuffer(tilesetBufferSize), canvas.createImageData(160, 144))
  },
  createMemoryWithRom(canvas, rom){
    const memory = new ArrayBuffer(expectedBufferSize)
    const tileset = new ArrayBuffer(tilesetBufferSize)
    const screen = canvas.createImageData(160, 144)
    return createMemory(canvas, memory,tileset, screen)
  }
}
