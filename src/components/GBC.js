import {element} from 'deku'
import {stepForwardCycle, stepBackwardCycle, showMemoryDump, play, stop, changeSpeed, changeThreshold, loadROM} from '../actions/GBCActions'
import {default as Memory, reg8, flags} from '../gbc/MemoryInterceptor'
import {OperationCodesMapping as opcodes} from './../../src/gbc/OperationCodesMapping'

let timerId = undefined

const onLoadROMClicked = (dispatch, context) => {
  return (event) => {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", "/testrom", true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function (oEvent) {
      var arrayBuffer = oReq.response; // Note: not oReq.responseText
      if (arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer);
        console.log('file loaded with size:',byteArray.byteLength)
        dispatch(loadROM(byteArray))
      }
    };
    oReq.send(null)
  }
}

const onNextCycleClicked = (dispatch, context) => {
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

const handleSpeedChange = (dispatch, context) => {
  return (event) => {
    dispatch(changeSpeed(parseInt(event.target.value, 10)))
  }
}

const handleThresholdChange = (dispatch, context) => {
  return (event) => {
    const val = parseInt(event.target.value, 10)
    if(val >= 1){
      dispatch(changeThreshold(val))
    } else {
      dispatch(changeThreshold(1))
    }
  }
}

const onPlayClicked = (dispatch, context) =>{
  return (event) => {
    if(timerId !== undefined){
      clearInterval(timerId)
      timerId = undefined
    }
    if(context.playingSpeed !== 0){
      if(context.playingSpeed > 0){
        timerId = setInterval(()=>{
          dispatch(stepForwardCycle())
        }, (1000/context.playingSpeed))
      } else {
        timerId = setInterval(()=>{
          dispatch(stepBackwardCycle())
        }, (1000/context.playingSpeed))
      }
      dispatch(play(context.playingSpeed))
    }
  }
}

const onStopClicked = (dispatch, context) => {
  return (event) => {
    if(timerId !== undefined){
      clearInterval(timerId)
      timerId = undefined
    }
    dispatch(stop(context.playingSpeed))
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
          <button onClick={onLoadROMClicked(dispatch, context)} disabled={context.playing}>Load test ROM</button>
        </div>
        <div>
          <button onClick={onPrevCycleClicked(dispatch, context)} disabled={context.playing}>Prev Step</button>
          <button onClick={onNextCycleClicked(dispatch, context)} disabled={context.playing}>Next Step</button>
        </div>
        <div>
          Speed: <input type='text' onChange={handleSpeedChange(dispatch, context)} size='4' value={context.playingSpeed} disabled={context.playing}></input>
          Threshold: <input type='text' onChange={handleThresholdChange(dispatch, context)} size='4' value={context.playingThreshold} disabled={context.playing}></input>
          <button onClick={onPlayClicked(dispatch, context)}>Play</button>
          <button onClick={onStopClicked(dispatch, context)}>Stop</button>
        </div>
        <div>
          <table>
            <tr>
              <td>Clock:{context.currentMemory.clock()}</td>
              <td>last instr took:{context.currentMemory.lastInstructionClock()}</td>
            </tr>
            <tr>
              <td>GPU Clock:{context.currentMemory.GPUClock()}</td>
              <td>next instr:{opcodes[context.currentMemory.readByte(context.currentMemory.PC())].name}</td>
            </tr>
            <tr>
              <td>GPU Line:{context.currentMemory.GPULine()}</td>
              <td>GPU Mode:{context.currentMemory.GPUMode()}</td>
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
            <button onClick={onShowMemoryDumpClicked(dispatch, context)} disabled={context.playing}>Show memory dump {context.showMemoryDump === true? 'ON' : 'OFF'}</button>
            <div class="memoryblock" innerHTML={(context.showMemoryDump === true) ? printMemory(context.currentMemory) : ''}></div>
          </div>
        </div>
      </div>
    )
  }
}
