import {default as Memory, reg8, flags} from './../../src/gbc/MemoryInterceptor'


export function stepGPU(opcodes, memory, onScanLine, onVBlank){
    memory.setGPUClock(memory.GPUClock() + memory.lastInstructionClock())
    switch( memory.GPUMode() ){
      case 2:
        if(memory.GPUClock() >= 80){
          memory.setGPUClock(0)
		      memory.setGPUMode(3)

        }
        break
      case 3:
        if(memory.GPUClock() >= 172){
          memory.setGPUClock(0)
		      memory.setGPUMode(0)
          onScanLine(memory)
          //renderscan
        }
        break
      case 0:
        if(memory.GPUClock() >= 204){
          memory.setGPUClock(0)
          memory.setGPULine(memory.GPULine() + 1)

          if(memory.GPULine() == 143){
              // Enter vblank
            memory.setGPUMode(1)
            onVBlank(memory)
            //GPU._canvas.putImageData(GPU._scrn, 0, 0);
          } else {
            memory.setGPUMode(2)
          }
        }
        break
      case 1:
        if(memory.GPUClock() >= 456){
          memory.setGPUClock(0)
          memory.setGPULine(memory.GPULine() + 1)
          if(memory.GPULine() > 153){
            memory.setGPUMode(2)
            memory.setGPULine(0)
          }
        }
        break
    }
}

export function stepTimer(memory){
  memory.setTimerDIVStep(memory.timerDIVStep() + memory.lastInstructionClock())
  if(memory.timerDIVStep() >= 64){
    memory.setTimerDIVStep(memory.timerDIVStep() - 64)
    memory.setTimerDIV(memory.timerDIV() + 1)
  }


  if(memory.timerTAC() & 4){
    memory.setTimerTIMAStep(memory.timerTIMAStep() + memory.lastInstructionClock())
    const threshold = speed[memory.timerTAC() & 3]
    if(memory.timerTIMAStep() >= threshold){
      memory.setTimerTIMAStep(memory.timerTIMAStep() - threshold)
      memory.setTimerTIMA(memory.timerTIMA() + 1)
      if(memory.timerTIMA() === 0){
        memory.setTimerTIMA(memory.timerTMA())
        memory.setInterruptFlags(memory.interruptFlags() | 4)
      }
    }
  }
}

export function handleInterrupts(rst40, memory){
  const ifired = memory.interruptEnabled() & memory.interruptFlags()

  if(ifired !== 0 && memory.flag(flags.halt) === true){
    memory.setFlag(flags.halt, false)
  }

  if(memory.flag(flags.interruptMasterEnabled) && ifired !== 0){

    for(let i=0;i<5;++i){
      let bit = (0x01 << i)
      if((ifired & bit) === 0)
        continue;

      memory.setFlag(flags.interruptMasterEnabled, false)
      memory.setInterruptFlags(memory.interruptFlags() & ~bit)
      rst40(i*8, memory)
      break
    }
  }
}

const formatHex = (val) => {
  let num = val.toString(16).toUpperCase()
  return ("0" + num).slice(-2)
}

const speed = [64, 1, 4 , 16]

export function step(opcodes, rst40, memory, onScanLine, onVBlank){
    if(!memory.flag(flags.halt)){
      const pc = memory.PC()
      const addr = memory.readByte( pc )
      const instr = opcodes[addr]
      memory.setPC(memory.PC() + 1)
      instr(memory)
    } else {
      memory.setLastInstructionClock(1)
    }

    stepTimer(memory)

    handleInterrupts(rst40, memory)

    memory.setClock(memory.clock()+memory.lastInstructionClock())
    stepGPU(opcodes, memory, onScanLine, onVBlank)
}

export function stepUntilVBlank(opcodes, memory){

}
