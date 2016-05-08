import {STEP_FORWARD_CYCLE,STEP_BACKWARD_CYCLE, SHOW_MEMORY_DUMP,SHOW_OAM_DUMP,SHOW_ADVANCED_OPTIONS, PLAY, STOP, CHANGE_SPEED, CHANGE_THRESHOLD, LOAD_ROM, SET_PC, KEY_UP, KEY_DOWN} from '../actions/GBCActions'
import {default as Memory, reg8, flags} from '../gbc/MemoryInterceptor'
import {RST_40} from '../gbc/OperationCodes'
import {OperationCodesMapping as opcodes} from '../gbc/OperationCodesMapping'
import {step, JOYPAD_PRESS} from '../gbc/CPU'

let canvas = document.getElementById('display').getContext('2d')

const createInitMemory = () => {
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
  initMemory.setPC(0x100)
  initMemory.setFlag(flags.interruptMasterEnabled, true)
  initMemory.setFlag(flags.halt, false)
  initMemory.setInputState(0xFF)
  return initMemory
}
const maxHistory = 200
const initialState = {
    history: [],
    currentMemory : createInitMemory(),
    showMemoryDump: false,
    showOAMDump: false,
    showAdvancedOptions: false,
    playing: false,
    playingSpeed: 100,
    playingThreshold: 10000
}

const KeyMapping = {
  39 : flags.keyRight,
  37 : flags.keyLeft,
  38 : flags.keyUp,
  40 : flags.keyDown,
  90 : flags.keyA,
  88 : flags.keyB,
  32 : flags.keySelect,
  13 : flags.keyStart
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

  if(!memory.flag(flags.bgtile)){
    tile = ((tile << 24) >> 24)
  }

  //console.log('bgtile', memory.flag(flags.bgtile))

  for(let i=0; i<160; ++i){
    let t = ((!memory.flag(flags.bgtile)) ? 256 : 0)
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
      if(!memory.flag(flags.bgtile)){
        tile = ((tile << 24) >> 24)
      }
    }
  }

  for(let i=0;i<40;++i){
    let oam = memory.readInt(0xFE00 + (i*4))
    const spriteY = ((oam & 0xFF) - 16)

    if(spriteY <= memory.GPULine() && (spriteY+8)>memory.GPULine()){
      const spriteX = ((oam>>8)&0xFF)-8
      const tile = ((oam>>16)&0xFF)
      const options = ((oam>>24)&0xFF)
      const spritePosition = ((options & 0x40) === 0) ? 0 : 1
      const yFlip = ((options&0x20) !== 0)
      const xFlip = ((options&0x20) !== 0)
      const pallete = ((options&0x20) === 0) ? 0 : 1

      const palleteData = pallete ? memory.GPUObj1Pallete : memory.GPUObj2Pallete

      const tilerow = memory.tilesetDataRow(tile, (memory.GPULine() - spriteY))

      let canvasOffset = (memory.GPULine() * 160 + spriteX) * 4
      for(let x = 0; x < 8; ++x){
        if((spriteX+x >= 0) && (spriteX+x <160) && tilerow[x]){
          const color = palleteData(tilerow[x])
          memory.setScreenData(canvasOffset+0, color[0])
			    memory.setScreenData(canvasOffset+1, color[1])
			    memory.setScreenData(canvasOffset+2, color[2])
			    memory.setScreenData(canvasOffset+3, color[3])
        }
        canvasOffset += 4
      }
    }
  }
}

const onVBlank = (memory)=>{
  canvas.putImageData(memory.screenDataObj(), 0, 0)
}

export default function GBCReducer(state = initialState, action) {
  let history
  let memory
  switch (action.type) {
    case LOAD_ROM:
      memory = createInitMemory()
      history = [...state.history, state.currentMemory]
      if(history.length>maxHistory){
        history = [...state.history.slice(1)]
      }
      memory.loadROM(action.data)
      return Object.assign({}, state,{
          history : history,
          currentMemory: memory
      })
    case STEP_FORWARD_CYCLE:
      memory = state.currentMemory.clone()
      for(let i=0; i < state.playingThreshold; ++i){
        step(opcodes,RST_40, memory, onScanLine, onVBlank)
      }
      history = [...state.history, state.currentMemory]
      if(history.length>maxHistory){
        history = [...state.history.slice(1)]
      }
      return Object.assign({}, state,{
          history : history,
          currentMemory: memory
      })
    case STEP_BACKWARD_CYCLE:
      if(state.history.length === 0)
        return state
      else {
        onVBlank(state.currentMemory)
        return Object.assign({}, state, {
          history : [...state.history.slice(0, state.history.length-1)],
          currentMemory: state.history[state.history.length-1]
        })
      }
    case SHOW_MEMORY_DUMP:
      return Object.assign({}, state, { showMemoryDump: action.flag})
    case SHOW_ADVANCED_OPTIONS:
      return Object.assign({}, state, { showAdvancedOptions: action.flag})
    case SHOW_OAM_DUMP:
      return Object.assign({}, state, { showOAMDump: action.flag})
    case PLAY:
      return Object.assign({}, state, { playing: true})
    case STOP:
      return Object.assign({}, state, { playing: false})
    case CHANGE_SPEED:
      return Object.assign({}, state, { playingSpeed: action.speed})
    case CHANGE_THRESHOLD:
      return Object.assign({}, state, { playingThreshold: action.threshold})
    case SET_PC:
      memory = state.currentMemory.clone()
      memory.setPC(action.pc)
      history = [...state.history, state.currentMemory]
      if(history.length>maxHistory){
        history = [...state.history.slice(1)]
      }
      return Object.assign({}, state,{
          history : history,
          currentMemory: memory
      })
    case KEY_DOWN:
      memory = state.currentMemory.clone()
      memory.setFlag(KeyMapping[action.key], false)
      memory.setInterruptFlags(memory.interruptFlags() | JOYPAD_PRESS)
      history = [...state.history, state.currentMemory]
      if(history.length>maxHistory){
        history = [...state.history.slice(1)]
      }
      return Object.assign({}, state,{
          history : history,
          currentMemory: memory
      })
    case KEY_UP:
      memory = state.currentMemory.clone()
      memory.setFlag(KeyMapping[action.key], true)
      memory.setInterruptFlags(memory.interruptFlags() | JOYPAD_PRESS)
      history = [...state.history, state.currentMemory]
      if(history.length>maxHistory){
        history = [...state.history.slice(1)]
      }
      return Object.assign({}, state,{
          history : history,
          currentMemory: memory
      })
    default:
      return state
  }
}
