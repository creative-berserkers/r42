import {element} from 'deku'
import {stepForwardCycle, stepBackwardCycle, showMemoryDump} from '../actions/GBCActions'
import {default as Memory, reg8, flags} from '../gbc/MemoryInterceptor'

const onNextCycleClicked = (dispatch) => {
  return (event) => {
    dispatch(stepForwardCycle())
  }
}

const onPrevCycleClicked = (dispatch) => {
  return (event) => {
    dispatch(stepBackwardCycle())
  }
}

const onShowMemoryDumpClicked = (dispatch, context) => {
  return (event) => {
    dispatch(showMemoryDump(!context.showMemoryDump))
  }
}

const formatHex = (val) => {
  let num = val.toString(16).toUpperCase()
  return ("0" + num).slice(-2)
}

const printMemory = (memory) => {
  let rows = []
  for(let i=0; i<Memory.expectedBufferSize;++i){
    if(i === memory.PC()){
      rows.push('<b class=\'pc-counter\'>'+formatHex(memory.readByte(i))+'</b>')
    } else {
      rows.push(formatHex(memory.readByte(i)))
    }
  }
  return rows
}

export default {
  render({dispatch, context}) {
    return (
      <div>
        <div>
          <button onClick={onPrevCycleClicked(dispatch)}>Prev Step</button>
          <button onClick={onNextCycleClicked(dispatch)}>Next Step</button>
        </div>
        <div>
          Speed: <input></input>
          <button onClick={onPlayClicked(dispatch)}>Play</button>
          <button onClick={onStopClicked(dispatch)}>Stop</button>
        </div>
        <div>
          <table>
            <tr>
              <td>Clock:{context.currentMemory.clock()}</td>
              <td>last instr took:{context.currentMemory.lastInstructionClock()}</td>
            </tr>
            <tr>
              <td>GPU Clock:{context.currentMemory.GPUClock()}</td>
              <td>GPU Mode:{context.currentMemory.GPUMode()}</td>
            </tr>
            <tr>
              <td>GPU Line:{context.currentMemory.GPULine()}</td>
              <td>--</td>
            </tr>
            <tr>
              <td>PC:0x{formatHex(context.currentMemory.PC())}</td>
              <td>SP:0x{formatHex(context.currentMemory.SP())}</td>
            </tr>
            <tr>
              <td>A:0x{formatHex(context.currentMemory.reg8(reg8.A))}</td>
              <td>F:0x{formatHex(context.currentMemory.reg8(reg8.F))}</td>
            </tr>
            <tr>
              <td>B:0x{formatHex(context.currentMemory.reg8(reg8.B))}</td>
              <td>C:0x{formatHex(context.currentMemory.reg8(reg8.C))}</td>
            </tr>
            <tr>
              <td>D:0x{formatHex(context.currentMemory.reg8(reg8.D))}</td>
              <td>E:0x{formatHex(context.currentMemory.reg8(reg8.E))}</td>
            </tr>
            <tr>
              <td>H:0x{formatHex(context.currentMemory.reg8(reg8.H))}</td>
              <td>L:0x{formatHex(context.currentMemory.reg8(reg8.L))}</td>
            </tr>
          </table>
          <div>
            <button onClick={onShowMemoryDumpClicked(dispatch, context)}>Show memory dump {context.showMemoryDump === true? 'ON' : 'OFF'}</button>
            <div class="memoryblock" innerHTML={(context.showMemoryDump === true) ? printMemory(context.currentMemory) : ''}></div>
          </div>
        </div>
      </div>
    )
  }
}
