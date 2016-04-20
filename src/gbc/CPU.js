
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

export function step(opcodes,memory, onScanLine, onVBlank){
    const pc = memory.PC()
    const addr = memory.readByte( pc )
    const instr = opcodes[addr]
    memory.setPC(memory.PC() + 1)
    instr(memory)
    memory.setClock(memory.clock()+memory.lastInstructionClock())
    stepGPU(opcodes, memory, onScanLine, onVBlank)
}

export function stepUntilVBlank(opcodes, memory){

}
