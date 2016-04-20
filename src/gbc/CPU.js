
export function step(opcodes,memory){
    const pc = memory.PC()
    const addr = memory.readByte( pc )
    const instr = opcodes[addr]
    memory.setPC(memory.PC() + 1)
    instr(memory)
    memory.setClock(memory.clock()+memory.lastInstructionClock())
}
