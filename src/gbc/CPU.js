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

const formatHex = (val) => {
  let num = val.toString(16).toUpperCase()
  return ("0" + num).slice(-2)
}

export function step(opcodes,memory, onScanLine, onVBlank){
    const pc = memory.PC()
    if(pc === 0x24){
      console.log('messing with demo')
    }
    //console.log(memory.readByte(pc))
    /*console.log(formatHex(pc),memory.SP().toString(16).toUpperCase(),
      formatHex(memory.reg8(reg8.A)),
      formatHex(memory.reg8(reg8.B)),
      formatHex(memory.reg8(reg8.C)),
      formatHex(memory.reg8(reg8.D)),
      formatHex(memory.reg8(reg8.E)),
      formatHex(memory.reg8(reg8.H)),
      formatHex(memory.reg8(reg8.L)),
      formatHex(memory.reg8(reg8.F)),
      formatHex(memory.clock()))*/
    const addr = memory.readByte( pc )
    const instr = opcodes[addr]
    memory.setPC(memory.PC() + 1)
    instr(memory)
    memory.setClock(memory.clock()+memory.lastInstructionClock())
    stepGPU(opcodes, memory, onScanLine, onVBlank)
}

export function stepUntilVBlank(opcodes, memory){

}
