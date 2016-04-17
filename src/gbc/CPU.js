
export function step(opcodes,memory){
    const instr = opcodes[memory.readByte( memory.PC() )]
    memory.setPC(memory.PC() + 1)
    instr(memory)
    memory.setClock(memory.clock()+memory.lastInstructionClock())
}