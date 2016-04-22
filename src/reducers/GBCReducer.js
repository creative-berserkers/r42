import {STEP_FORWARD_CYCLE,STEP_BACKWARD_CYCLE, SHOW_MEMORY_DUMP, PLAY, STOP, CHANGE_SPEED, CHANGE_THRESHOLD, LOAD_ROM, SET_PC} from '../actions/GBCActions'
import {default as Memory, reg8, flags} from '../gbc/MemoryInterceptor'
import {OperationCodesMapping as opcodes} from '../gbc/OperationCodesMapping'
import {step} from '../gbc/CPU'

let canvas = document.getElementById('display').getContext('2d')

const initMemory = Memory.createEmptyMemoryFromCanvas(canvas)

initMemory.setSP(0xFFFE)
initMemory.setReg8(reg8.A, 0x01)
initMemory.setReg8(reg8.B, 0x00)
initMemory.setReg8(reg8.C, 0x13)
initMemory.setReg8(reg8.D, 0x00)
initMemory.setReg8(reg8.E, 0xD8)
initMemory.setReg8(reg8.H, 0x01)
initMemory.setReg8(reg8.L, 0x4D)
initMemory.setReg8(reg8.F, 0xB0)
initMemory.setPC(0x00)

const maxHistory = 100
const initialState = {
    history: [],
    currentMemory : initMemory,
    showMemoryDump: false,
    playing: false,
    playingSpeed: 1,
    playingThreshold: 1
}

const onScanLine = (memory) =>{
  //console.log('scanLine')
  let line = memory.GPULine()
  let scrollX = memory.GPUScrollX()
  let scrollY = memory.GPUScrollY()

  let mapOffset = memory.flag(flags.bgmap) ? 0x9C00 : 0x9800
  mapOffset += ( Math.floor(((memory.GPULine() + scrollY) % 256) / 8) * 32)

  let lineOffset = Math.floor((scrollX / 8))

  let y = (memory.GPULine() + scrollY) % 8
  let x = scrollX % 8

  let canvasOffset = memory.GPULine() * 160 * 4

  let color
  let tile = memory.readByte(mapOffset + lineOffset)

  //if(memory.flag(flags.bgtile) && tile < 128) tile += 256

  if(!memory.flag(flags.bgtile) && tile >= 128){
    tile = ((tile << 24) >> 24)
  }

  console.log('bgtile', memory.flag(flags.bgtile))

  for(let i=0; i<160; ++i){
    let t = ((!memory.flag(flags.bgtile) && tile >= 128) ? 256 : 0)
    let pixel = memory.tilesetData(tile + t, x, y)
    //console.log('pixel:', pixel)
    color = memory.GPUPallete(pixel)
    //let c = (tile < 20) ? 255 : 0;
    memory.setScreenData(canvasOffset+0, color[0])
    memory.setScreenData(canvasOffset+1, color[1])
    memory.setScreenData(canvasOffset+2, color[2])
    memory.setScreenData(canvasOffset+3, color[3])
    canvasOffset+=4
    x++
    if(x === 8){
      x = 0
      lineOffset = ((lineOffset + 1) % 32)
      tile = memory.readByte(mapOffset + lineOffset)
      if(!memory.flag(flags.bgtile) && tile >= 128){
        tile = ((tile << 24) >> 24)
      }
    }
  }

  /*if(memory.flag(flags.switchlcd)){
    let scanRow = []
    for(let i=0; i<160; i++) scanRow[i] = 0;
    if(memory.flag(flags.switchbg)){
      var linebase = line * 640;
      var mapbase = memory.flag(flags.bgmap) + ((((line+scrollY)&255)>>3)<<5);
      var y = (line+scrollY)&7;
      var x = scrollX&7;
      var t = (scrollX>>3)&31;
      var pixel;
      var w=160;

      if(memory.flag(flags.bgtile)){
        var tile = memory.readByte(mapbase+t)
        if(tile<128) tile=256+tile;
        var tilerow = memory.tilesetDataRow(tile,y);
        do {
          scanRow[160-x] = tilerow[x];
          memory.setScreenData(linebase+3, memory.GPUPallete(tilerow[x]))
          x++;
          if(x==8) { t=(t+1)&31; x=0; tile=memory.readByte(mapbase+t); if(tile<128) tile=256+tile; tilerow = memory.tilesetDataRow(tile,y); }
          linebase+=4;
        } while(--w);
      } else {
        var tilerow=memory.tilesetDataRow(memory.readByte(mapbase+t),y)
        do {
          scanRow[160-x] = tilerow[x];
          memory.setScreenData(linebase+3 , memory.GPUPallete(tilerow[x]))
          x++;
          if(x==8) { t=(t+1)&31; x=0; tilerow=memory.tilesetDataRow(memory.readByte(mapbase+t),y); }
          linebase+=4;
        } while(--w);
      }
    }
  }*/
}

const onVBlank = (memory)=>{
  canvas.putImageData(memory.screenDataObj(), 0, 0)
}

export default function GBCReducer(state = initialState, action) {
  let history
  switch (action.type) {
    case LOAD_ROM:
      const newMemory1 = state.currentMemory.clone()
      history = [...state.history, state.currentMemory]
      if(history.length>maxHistory){
        history = [...state.history.slice(1)]
      }
      newMemory1.loadROM(action.data)
      return Object.assign({}, state,{
          history : history,
          currentMemory: newMemory1
      })
    case STEP_FORWARD_CYCLE:
      const newMemory2 = state.currentMemory.clone()
      for(let i=0; i < state.playingThreshold; ++i){
        step(opcodes, newMemory2, onScanLine, onVBlank)
      }
      history = [...state.history, state.currentMemory]
      if(history.length>maxHistory){
        history = [...state.history.slice(1)]
      }
      return Object.assign({}, state,{
          history : history,
          currentMemory: newMemory2
      })
    case STEP_BACKWARD_CYCLE:
      if(state.history.length === 0)
        return state
      else return Object.assign({}, state, {
          history : [...state.history.slice(0, state.history.length-1)],
          currentMemory: state.history[state.history.length-1]
      })
    case SHOW_MEMORY_DUMP:
      return Object.assign({}, state, { showMemoryDump: action.flag})
    case PLAY:
      return Object.assign({}, state, { playing: true})
    case STOP:
      return Object.assign({}, state, { playing: false})
    case CHANGE_SPEED:
      return Object.assign({}, state, { playingSpeed: action.speed})
    case CHANGE_THRESHOLD:
      return Object.assign({}, state, { playingThreshold: action.threshold})
    case SET_PC:
      const newMemory3 = state.currentMemory.clone()
      newMemory3.setPC(action.pc)
      history = [...state.history, state.currentMemory]
      if(history.length>maxHistory){
        history = [...state.history.slice(1)]
      }
      return Object.assign({}, state,{
          history : history,
          currentMemory: newMemory3
      })
    default:
      return state
  }
}
