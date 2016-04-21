import {STEP_FORWARD_CYCLE,STEP_BACKWARD_CYCLE, SHOW_MEMORY_DUMP, PLAY, STOP, CHANGE_SPEED, CHANGE_THRESHOLD, LOAD_ROM} from '../actions/GBCActions'
import {default as Memory, reg8, flags} from '../gbc/MemoryInterceptor'
import {OperationCodesMapping as opcodes} from '../gbc/OperationCodesMapping'
import {step} from '../gbc/CPU'

let canvas = document.getElementById('display').getContext('2d')

const initialState = {
    history: [],
    currentMemory : Memory.createEmptyMemory(canvas),
    showMemoryDump: false,
    playing: false,
    playingSpeed: 1,
    playingThreshold: 1
}

const onScanLine = (memory) =>{
  console.log('scanLine')

  let mapOffset = memory.flag(flags.bgmap) ? 0x9C00 : 0x9800
  mapOffset += (((memory.GPULine() + memory.GPUScrollY()) & 255) >> 3)

  let lineOffset = (memory.GPUScrollX() >> 3)

  let y = (memory.GPULine() + memory.GPUScrollY()) & 7
  let x = memory.GPUScrollX() & 7

  let canvasOffset = memory.GPULine() * 160 * 4

  let color
  let tile = memory.readByte(mapOffset + lineOffset)

  if(memory.flag(flags.bgtile) && tile < 128) tile += 256

  for(let i=0; i<160; ++i){
    color = memory.GPUPallete(memory.tilesetData(tile, x, y))

    memory.setScreenData(canvasOffset+0, color)
    memory.setScreenData(canvasOffset+1, color)
    memory.setScreenData(canvasOffset+2, color)
    memory.setScreenData(canvasOffset+3, 255)
    canvasOffset+=4
    x++
    if(x === 8){
      x = 0
      lineOffset = ((lineOffset + 1) & 31)
      let tile = memory.readByte(mapOffset + lineOffset)
      if(memory.flag(flags.bgtile) && tile < 128) tile += 256
    }
  }
}

const onVBlank = (memory)=>{
  canvas.putImageData(memory.screenDataObj(), 0, 0)
}

export default function GBCReducer(state = initialState, action) {
    switch (action.type) {
      case LOAD_ROM:
        const newMemory1 = state.currentMemory.clone()
        newMemory1.loadROM(action.data)
        return Object.assign({}, state,{
            history : [...state.history, state.currentMemory],
            currentMemory: newMemory1
        })
      case STEP_FORWARD_CYCLE:
        const newMemory2 = state.currentMemory.clone()
        for(let i=0; i < state.playingThreshold; ++i){
          step(opcodes, newMemory2, onScanLine, onVBlank)
        }
        return Object.assign({}, state,{
            history : [...state.history, state.currentMemory],
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
      default:
        return state
    }
}
