import {expect} from 'chai'
import {default as Memory, reg8, flags} from './../../src/gbc/MemoryInterceptor'
import {OperationCodesMapping as opcodes} from './../../src/gbc/OperationCodesMapping'
import {step} from './../../src/gbc/CPU'

function logState(memory){
  console.log(
    'CPU:',memory.clock(),
    'linst:',memory.lastInstructionClock(),
    'PC:',memory.PC().toString(16).toUpperCase(),
    'SP:', memory.SP().toString(16).toUpperCase(),
    'HL:', memory.HL().toString(16).toUpperCase(),
    'A:',memory.reg8(reg8.A).toString(16).toUpperCase(),
    'B:',memory.reg8(reg8.B).toString(16).toUpperCase(),
    'C:',memory.reg8(reg8.C).toString(16).toUpperCase(),
    'D:',memory.reg8(reg8.D).toString(16).toUpperCase(),
    'E:',memory.reg8(reg8.E).toString(16).toUpperCase(),
    'F:',memory.reg8(reg8.F).toString(16).toUpperCase(),
    'H:',memory.reg8(reg8.H).toString(16).toUpperCase(),
    'L:',memory.reg8(reg8.L).toString(16).toUpperCase(),
    'f(Z):', memory.flag(flags.zero),
    'f(S):', memory.flag(flags.subtract),
    'f(H):', memory.flag(flags.halfCarry),
    'f(C):', memory.flag(flags.carry),
    'f(isOutOfBios)',memory.flag(flags.isOutOfBios))
}

describe('CPU test', ()=>{
  it('',()=>{
    const memory = Memory.createEmptyMemory()
    console.log('Init memory')
    logState(memory)
    console.log('Starting simulation')
    for(let i=0; i< 10 ; ++i){
      console.log(i++,': Next opcode is[',memory.readByte( memory.PC() ).toString(16),']:',opcodes[memory.readByte( memory.PC() )].name)
      step(opcodes, memory, ()=>{}, ()=>{})
      logState(memory)
    }
  })
});
