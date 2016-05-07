import {default as Memory, reg8, flags} from './../../src/gbc/MemoryInterceptor'

export const VERTICAL_BLANK	= 0x01
export const LCD_STATUS = 0x02
export const TIMER_OVERFLOW	= 0x04
export const SERIAL_LINK = 0x08
export const JOYPAD_PRESS = 0x10

const speed = [64, 1, 4 , 16]

function checkLineCompare(memory){
  if(memory.GPUStat() & 0b01000000){
    memory.setInterruptFlags(memory.interruptFlags() | LCD_STATUS)
  }
  if(memory.GPULine() === memory.GPULineCompare()){
    memory.setGPUStat(memory.GPUStat() | 0b00000100)
  } else {
    memory.setGPUStat(memory.GPUStat() & 0b11111011)
  }
}

export function stepGPU(opcodes, memory, onScanLine, onVBlank){
    memory.setGPUClock(memory.GPUClock() + memory.lastInstructionClock())
    switch( memory.GPUMode() ){
      case 2:
        if(memory.GPUClock() >= 80){
          memory.setGPUClock(0)
		      memory.setGPUMode(3)
          memory.setGPUStat(memory.GPUStat() & 0b11111100)
          memory.setGPUStat(memory.GPUStat() | 0b00000011)
        }
        break
      case 3:
        if(memory.GPUClock() >= 172){
          memory.setGPUClock(0)
		      memory.setGPUMode(0)
          if(memory.GPUStat() & 0b00001000){
            memory.setInterruptFlags(memory.interruptFlags() | LCD_STATUS)
          }
          memory.setGPUStat(memory.GPUStat() & 0b11111100)
          onScanLine(memory)
          //renderscan
        }
        break
      case 0:
        if(memory.GPUClock() >= 204){
          memory.setGPUClock(0)
          memory.setGPULine(memory.GPULine() + 1)
          checkLineCompare(memory)
          if(memory.GPULine() == 143){
              // Enter vblank
            memory.setGPUMode(1)
            /*if(memory.GPUStat() & 0b00010000){
              memory.setInterruptFlags(memory.interruptFlags() | 1)
            }*/
            memory.setGPUStat(memory.GPUStat() & 0b11111100)
            memory.setGPUStat(memory.GPUStat() | 0b00000001)
            memory.setInterruptFlags(memory.interruptFlags() | VERTICAL_BLANK)
            onVBlank(memory)
          } else {
            memory.setGPUMode(2)
          }
        }
        break
      case 1:
        if(memory.GPUClock() >= 456){
          memory.setGPUClock(0)
          memory.setGPULine(memory.GPULine() + 1)
          checkLineCompare(memory)
          if(memory.GPULine() > 153){
            memory.setGPUMode(2)
            if(memory.GPUStat() & 0b00100000){
              memory.setInterruptFlags(memory.interruptFlags() | LCD_STATUS)
            }
            memory.setGPUStat(memory.GPUStat() & 0b11111100)
            memory.setGPUStat(memory.GPUStat() | 0b00000010)
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
        memory.setInterruptFlags(memory.interruptFlags() | TIMER_OVERFLOW)
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

      //console.log('interrupt',(0x40+i*8).toString(16),memory.GPUStat())

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
