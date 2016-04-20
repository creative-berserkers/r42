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
  return val.toString(16).toUpperCase()
}

const printMemory = (memory) => {
  let rows = []
  for(let i=0; i<256;++i){
    if(i === memory.PC()){
      rows.push(<b id='{i}'>{formatHex(memory.readByte(i))}</b>)
    } else {
      rows.push(<span id={i}>{formatHex(memory.readByte(i))}</span>)
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
          <table>
            <tr>
              <td>Clock:{context.currentMemory.clock()}</td>
              <td>last instr took:{context.currentMemory.lastInstructionClock()}</td>
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
            <div class="memoryblock">{ (context.showMemoryDump === true) ? printMemory(context.currentMemory) : <span />}</div>
          </div>
        </div>
      </div>
    )
  }
}
