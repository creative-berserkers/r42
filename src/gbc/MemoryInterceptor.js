import Memory, {flags, reg8} from './Memory'

const bios = [
  0x31, 0xFE, 0xFF, 0xAF, 0x21, 0xFF, 0x9F, 0x32, 0xCB, 0x7C, 0x20, 0xFB, 0x21, 0x26, 0xFF, 0x0E,
  0x11, 0x3E, 0x80, 0x32, 0xE2, 0x0C, 0x3E, 0xF3, 0xE2, 0x32, 0x3E, 0x77, 0x77, 0x3E, 0xFC, 0xE0,
  0x47, 0x11, 0x04, 0x01, 0x21, 0x10, 0x80, 0x1A, 0xCD, 0x95, 0x00, 0xCD, 0x96, 0x00, 0x13, 0x7B,
  0xFE, 0x34, 0x20, 0xF3, 0x11, 0xD8, 0x00, 0x06, 0x08, 0x1A, 0x13, 0x22, 0x23, 0x05, 0x20, 0xF9,
  0x3E, 0x19, 0xEA, 0x10, 0x99, 0x21, 0x2F, 0x99, 0x0E, 0x0C, 0x3D, 0x28, 0x08, 0x32, 0x0D, 0x20,
  0xF9, 0x2E, 0x0F, 0x18, 0xF3, 0x67, 0x3E, 0x64, 0x57, 0xE0, 0x42, 0x3E, 0x91, 0xE0, 0x40, 0x04,
  0x1E, 0x02, 0x0E, 0x0C, 0xF0, 0x44, 0xFE, 0x90, 0x20, 0xFA, 0x0D, 0x20, 0xF7, 0x1D, 0x20, 0xF2,
  0x0E, 0x13, 0x24, 0x7C, 0x1E, 0x83, 0xFE, 0x62, 0x28, 0x06, 0x1E, 0xC1, 0xFE, 0x64, 0x20, 0x06,
  0x7B, 0xE2, 0x0C, 0x3E, 0x87, 0xF2, 0xF0, 0x42, 0x90, 0xE0, 0x42, 0x15, 0x20, 0xD2, 0x05, 0x20,
  0x4F, 0x16, 0x20, 0x18, 0xCB, 0x4F, 0x06, 0x04, 0xC5, 0xCB, 0x11, 0x17, 0xC1, 0xCB, 0x11, 0x17,
  0x05, 0x20, 0xF5, 0x22, 0x23, 0x22, 0x23, 0xC9, 0xCE, 0xED, 0x66, 0x66, 0xCC, 0x0D, 0x00, 0x0B,
  0x03, 0x73, 0x00, 0x83, 0x00, 0x0C, 0x00, 0x0D, 0x00, 0x08, 0x11, 0x1F, 0x88, 0x89, 0x00, 0x0E,
  0xDC, 0xCC, 0x6E, 0xE6, 0xDD, 0xDD, 0xD9, 0x99, 0xBB, 0xBB, 0x67, 0x63, 0x6E, 0x0E, 0xEC, 0xCC,
  0xDD, 0xDC, 0x99, 0x9F, 0xBB, 0xB9, 0x33, 0x3E, 0x3c, 0x42, 0xB9, 0xA5, 0xB9, 0xA5, 0x42, 0x4C,
  0x21, 0x04, 0x01, 0x11, 0xA8, 0x00, 0x1A, 0x13, 0xBE, 0x20, 0xFE, 0x23, 0x7D, 0xFE, 0x34, 0x20,
  0xF5, 0x06, 0x19, 0x78, 0x86, 0x23, 0x05, 0x20, 0xFB, 0x86, 0x20, 0xFE, 0x3E, 0x01, 0xE0, 0x50]

let canvas = (typeof document !== 'undefined')? document.getElementById('tileset').getContext('2d') : null

const renderTileset = (memory, tile) => {
    let tileY = Math.floor(tile / 32)
    let tileX = tile % 32

    var id = canvas.createImageData(8,8);

    for (var i = 0; i < id.data.length; i += 4) {
        let y = Math.floor((i/4)/8)
        let x = ((i/4)%8)
        let data = memory.tilesetData(tile, x,y)
        id.data[i+0] = data*85;
        id.data[i+1] = data*85;
        id.data[i+2] = data*85;
        id.data[i+3] = 255;
    }
    canvas.putImageData( id, tileX*8, tileY*8)
  //console.log('rendered tileset');
}

const updateTile = (memory, addr, val) => {
  	// Work out which tile and row was updated
  if(addr&1) { addr--; }

	let tile = (addr >> 4) & 511
	let y = (addr >> 1) & 7

	let sx
	for(let x = 0; x < 8; x++){
	    // Find bit index for this pixel
	    sx = 1 << (7-x);
	    // Update tile set
      const val = ((memory.readByte(addr) & sx)   ? 1 : 0) + ((memory.readByte(addr +1) & sx) ? 2 : 0)
      memory.setTilesetData(tile, x, y, val )
	}
  renderTileset(memory, tile)
}

function createMemoryInterceptor(memory){

  const interceptedMemory = memory

  const interceptor = {
    clone(){
        return createMemoryInterceptor(memory.clone())
    },
    readByte(addr){
      if ((addr & 0xF000) === 0x0000) {
        if (!interceptedMemory.flag(flags.isOutOfBios)) { //read bios?
          if (addr < 0x0100)
            return bios[addr]
          else if (interceptedMemory.PC() === 0x0100)
            interceptedMemory.setFlag(flags.isOutOfBios, true)
        }
      }
      if((addr & 0xF000) === 0xE000) { //shadow ram
        return interceptedMemory.readByte(addr & 0xDFFF)
      }
      if((addr & 0xFE00) === 0xFE00) {
        //console.log('unsupported read', addr.toString(16))
        //gpu stuff
      }
      if((addr & 0xFF00) === 0xFF00) {
        //io stuff
        if(addr === 0xFF00){ //keys
          // input read, pass trough
        } else if(addr === 0xFF40){
            return (interceptedMemory.flag(flags.switchbg)? 0x01:0x00) |
              (interceptedMemory.flag(flags.bgmap) ? 0x08 : 0x00) |
              (interceptedMemory.flag(flags.bgtile) ? 0x10 : 0x00) |
              (interceptedMemory.flag(flags.switchlcd) ? 0x80 : 0x00)
        } else if(addr === 0xFF41){
          let val = interceptedMemory.readByte(addr)
          //console.log('reading 0xFF41', val)
          return val
        } else if(addr === 0xFF42) {
          return interceptedMemory.GPUScrollY()
        } else if(addr === 0xFF43){
          return interceptedMemory.GPUScrollX()
        } else if(addr === 0xFF44){
          return interceptedMemory.GPULine()
        } else if(addr < 0xFFFE && addr > 0xFF80){
          //stack
        } else {
          //console.log('unsupported read', addr.toString(16))
        }
      }

      return interceptedMemory.readByte(addr)
    },
    writeByte(addr, value){
      if(addr < 0x8000){
        //TODO: handle banking
        return
      }
      if(((addr & 0xF000) === 0x8000) || ((addr & 0xF000) === 0x9000)){
        interceptedMemory.writeByte(addr, value)
        updateTile(interceptedMemory, addr, value)
        return
      } else if((addr & 0xFF00) === 0xFF00){
        if(addr === 0xFF00){//keys
          const inputColumn = value & 0x30
          if(inputColumn === 0x20){
            interceptedMemory.writeByte(addr, (inputColumn | (memory.inputState() & 0b00001111)))
          } else if(inputColumn === 0x10){
            interceptedMemory.writeByte(addr, (inputColumn | (memory.inputState() >> 4)))
          }
          return
        } else if(addr === 0xFF04){
          interceptedMemory.writeByte(addr, 0x00)
          return
        } else if(addr === 0xFF07){
          interceptedMemory.writeByte(addr, value & 7)
          return
        } else if(addr === 0xFF40){
          interceptedMemory.setFlag(flags.switchbg, (value & 0x01) ? true : false)
          interceptedMemory.setFlag(flags.bgmap, (value & 0x08) ? true : false)
          interceptedMemory.setFlag(flags.bgtile, (value & 0x10) ? true : false)
          interceptedMemory.setFlag(flags.switchlcd, (value & 0x80) ? true : false)
          return
        } else if(addr === 0xFF41){
          //console.log('writing 0xFF41 with ',value)
          let val1 = (value & 0b11111000)
          let val2 = (interceptedMemory.readByte(addr) & 0b00000111)
          interceptedMemory.writeByte(addr, val1 | val2)
          return
        } else if(addr === 0xFF42){
          interceptedMemory.setGPUScrollY(value)
          return
        } else if(addr === 0xFF43){
          interceptedMemory.setGPUScrollX(value)
          return
        } else if(addr === 0xFF46){
          //console.log('writing ', addr, value)
        } else if(addr === 0xFF47){
          for(let i=0; i < 4; ++i){
            switch((value >> (i * 2)) & 3){
              case 0 : interceptedMemory.setGPUPallete(i, [255,255,255,255]); break
              case 1 : interceptedMemory.setGPUPallete(i, [192,192,192,255]); break
              case 2 : interceptedMemory.setGPUPallete(i, [96, 96, 96, 255]); break
              case 3 : interceptedMemory.setGPUPallete(i, [0, 0, 0, 255]); break
            }
          }
          return
        } else if(addr < 0xFFFE && addr > 0xFF80){
          //stack
        } else {
          //console.log('unsuported write', addr.toString(16), ' ', value.toString(16))
        }
      }
      interceptedMemory.writeByte(addr, value)
    },
    readWord(addr){
      return (interceptor.readByte(addr) + (interceptor.readByte(addr+1)<<8))
    },
    writeWord(addr, value){
      interceptor.writeByte(addr, value)
      interceptor.writeByte(addr+1, value)
    },
    reg8(addr){
      return interceptedMemory.reg8(addr)
    },
    setReg8(addr, value){
      interceptedMemory.setReg8(addr, value)
    },
    PC(){
      return interceptedMemory.PC()
    },
    setPC(value){
      interceptedMemory.setPC(value)
    },
    SP(){
      return interceptedMemory.SP()
    },
    setSP(value){
      interceptedMemory.setSP(value)
    },
    HL(){
      return interceptedMemory.HL()
    },
    clock(){
      return interceptedMemory.clock()
    },
    setClock(value){
      interceptedMemory.setClock(value)
    },
    GPUClock(){
        return interceptedMemory.GPUClock()
    },
    setGPUClock(value){
        interceptedMemory.setGPUClock(value)
    },
    timerDIV(){
      return interceptedMemory.timerDIV()
    },
    setTimerDIV(value){
      interceptedMemory.setTimerDIV(value)
    },
    timerDIVStep(){
      return interceptedMemory.timerDIVStep()
    },
    setTimerDIVStep(value){
      interceptedMemory.setTimerDIVStep(value)
    },
    timerTIMA(){
      return interceptedMemory.timerTIMA()
    },
    setTimerTIMA(value){
      interceptedMemory.setTimerTIMA(value)
    },
    timerTIMAStep(){
      return interceptedMemory.timerTIMAStep()
    },
    setTimerTIMAStep(value){
      interceptedMemory.setTimerTIMAStep(value)
    },
    timerTMA(){
      return interceptedMemory.timerTMA()
    },
    setTimerTMA(value){
      interceptedMemory.setTimerTMA(value)
    },
    timerTAC(){
      return interceptedMemory.timerTAC()
    },
    setTimerTAC(value){
      interceptedMemory.setTimerTAC(value)
    },
    lastInstructionClock(){
      return interceptedMemory.lastInstructionClock()
    },
    setLastInstructionClock(value){
      interceptedMemory.setLastInstructionClock(value)
    },
    GPUStat(){
      return interceptedMemory.GPUStat()
    },
    setGPUStat(value){
      interceptedMemory.setGPUStat(value)
    },
    GPUMode(){
      return interceptedMemory.GPUMode()
    },
    setGPUMode(mode){
      interceptedMemory.setGPUMode(mode)
    },
    GPULine(){
      return interceptedMemory.GPULine()
    },
    setGPULine(line){
      interceptedMemory.setGPULine(line)
    },
    GPUScrollX(){
      return interceptedMemory.GPUScrollX()
    },
    setGPUScrollX(value){
      interceptedMemory.setGPUScrollX(value)
    },
    GPUScrollY(){
      return interceptedMemory.GPUScrollY()
    },
    setGPUScrollY(value){
      interceptedMemory.setGPUScrollY(value)
    },
    GPULineCompare(){
      return interceptedMemory.GPULineCompare()
    },
    setGPULineCompare(value){
      interceptedMemory.setGPULineCompare(value)
    },
    GPUBGTile(){
      return interceptedMemory.GPUBGTile()
    },
    GPUPallete(index){
      return interceptedMemory.GPUPallete(index)
    },
    setGPUPallete(index, value){
      interceptedMemory.setGPUPallete(index, value)
    },
    setGPUBGTile(value){
      interceptedMemory.setGPUBGTile(value)
    },
    interruptFlags(){
      return interceptedMemory.interruptFlags()
    },
    setInterruptFlags(value){
      interceptedMemory.setInterruptFlags(value)
    },
    interruptEnabled(){
      return interceptedMemory.interruptEnabled()
    },
    setInterruptEnabled(value){
      interceptedMemory.setInterruptEnabled(value)
    },
    tilesetData(tile, x, y){
      return interceptedMemory.tilesetData(tile, x, y)
    },
    setTilesetData(tile, x, y,val){
      interceptedMemory.setTilesetData(tile, x, y, val)
    },
    tilesetDataRow(tile, y){
      return interceptedMemory.tilesetDataRow(tile, y)
    },
    screenData(index){
      return interceptedMemory.screenData(index)
    },
    setScreenData(index, value){
      interceptedMemory.setScreenData(index, value)
    },
    screenDataObj(){
      return interceptedMemory.screenDataObj()
    },
    flag(flag){
      return interceptedMemory.flag(flag)
    },
    setFlag(flag, state){
      interceptedMemory.setFlag(flag, state)
    },
    loadROM(data){
      interceptedMemory.loadROM(data)
    },
    inputState(){
      return interceptedMemory.inputState()
    },
    setInputState(value){
      interceptedMemory.setInputState(value)
    }
  }

  return interceptor
}

export {reg8, flags} from './Memory'

export default {
  expectedBufferSize: Memory.expectedBufferSize,
  createEmptyMemoryFromCanvas(canvas){
    return createMemoryInterceptor(Memory.createEmptyMemoryFromCanvas(canvas))
  },
  createEmptyMemory(){
    return createMemoryInterceptor(Memory.createEmptyMemory())
  }
}
