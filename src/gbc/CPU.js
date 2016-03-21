import Memory from './Memory'

export function step(opcodes,memory){
    opcodes[memory.readByte( memory.PC() )](memory)
    memory.setPC(memory.PC() & 65535)
    memory.setClock(memory.clock()+memory.lastInstructionClock)
}