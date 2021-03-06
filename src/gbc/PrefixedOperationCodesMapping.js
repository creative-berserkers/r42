import * as opcodes from './PrefixedOperationCodes'
import {reg8} from './Memory'

export const PrefixedOperationCodesMapping = [
  //0x00
  opcodes.RLC_X.bind(undefined,reg8.B),
  opcodes.RLC_X.bind(undefined,reg8.C),
  opcodes.RLC_X.bind(undefined,reg8.D),
  opcodes.RLC_X.bind(undefined,reg8.E),
  opcodes.RLC_X.bind(undefined,reg8.H),
  opcodes.RLC_X.bind(undefined,reg8.L),
  opcodes.RLC_mXY.bind(undefined, reg8.H, reg8.L),
  opcodes.RLC_X.bind(undefined, reg8.A),
  opcodes.RRC_X.bind(undefined,reg8.B),
  opcodes.RRC_X.bind(undefined,reg8.C),
  opcodes.RRC_X.bind(undefined,reg8.D),
  opcodes.RRC_X.bind(undefined,reg8.E),
  opcodes.RRC_X.bind(undefined,reg8.H),
  opcodes.RRC_X.bind(undefined,reg8.L),
  opcodes.RRC_mXY.bind(undefined, reg8.H, reg8.L),
  opcodes.RRC_X.bind(undefined, reg8.A),
  //0x10
  opcodes.RL_X.bind(undefined, reg8.B),
  opcodes.RL_X.bind(undefined,reg8.C),
  opcodes.RL_X.bind(undefined,reg8.D),
  opcodes.RL_X.bind(undefined,reg8.E),
  opcodes.RL_X.bind(undefined,reg8.H),
  opcodes.RL_X.bind(undefined,reg8.L),
  opcodes.RL_mXY.bind(undefined, reg8.H, reg8.L),
  opcodes.RL_X.bind(undefined, reg8.A),
  opcodes.RR_X.bind(undefined, reg8.B),
  opcodes.RR_X.bind(undefined,reg8.C),
  opcodes.RR_X.bind(undefined,reg8.D),
  opcodes.RR_X.bind(undefined,reg8.E),
  opcodes.RR_X.bind(undefined,reg8.H),
  opcodes.RR_X.bind(undefined,reg8.L),
  opcodes.RR_mXY.bind(undefined, reg8.H, reg8.L),
  opcodes.RR_X.bind(undefined, reg8.A),
  //0x20
  opcodes.SLA_X.bind(undefined, reg8.B),
  opcodes.SLA_X.bind(undefined,reg8.C),
  opcodes.SLA_X.bind(undefined,reg8.D),
  opcodes.SLA_X.bind(undefined,reg8.E),
  opcodes.SLA_X.bind(undefined,reg8.H),
  opcodes.SLA_X.bind(undefined,reg8.L),
  opcodes.SLA_mXY.bind(undefined, reg8.H, reg8.L),
  opcodes.SLA_X.bind(undefined, reg8.A),
  opcodes.SRA_X.bind(undefined, reg8.B),
  opcodes.SRA_X.bind(undefined,reg8.C),
  opcodes.SRA_X.bind(undefined,reg8.D),
  opcodes.SRA_X.bind(undefined,reg8.E),
  opcodes.SRA_X.bind(undefined,reg8.H),
  opcodes.SRA_X.bind(undefined,reg8.L),
  opcodes.SRA_mXY.bind(undefined, reg8.H, reg8.L),
  opcodes.SRA_X.bind(undefined, reg8.A),
  //0x30
  opcodes.SWAP_X.bind(undefined, reg8.B),
  opcodes.SWAP_X.bind(undefined,reg8.C),
  opcodes.SWAP_X.bind(undefined,reg8.D),
  opcodes.SWAP_X.bind(undefined,reg8.E),
  opcodes.SWAP_X.bind(undefined,reg8.H),
  opcodes.SWAP_X.bind(undefined,reg8.L),
  opcodes.SWAP_mXY.bind(undefined, reg8.H, reg8.L),
  opcodes.SWAP_X.bind(undefined, reg8.A),
  opcodes.SRL_X.bind(undefined, reg8.B),
  opcodes.SRL_X.bind(undefined,reg8.C),
  opcodes.SRL_X.bind(undefined,reg8.D),
  opcodes.SRL_X.bind(undefined,reg8.E),
  opcodes.SRL_X.bind(undefined,reg8.H),
  opcodes.SRL_X.bind(undefined,reg8.L),
  opcodes.SRL_mXY.bind(undefined, reg8.H, reg8.L),
  opcodes.SRL_X.bind(undefined, reg8.A),
  //0x40
  opcodes.BIT_bit_X.bind(undefined,0, reg8.B),
  opcodes.BIT_bit_X.bind(undefined,0, reg8.C),
  opcodes.BIT_bit_X.bind(undefined,0, reg8.D),
  opcodes.BIT_bit_X.bind(undefined,0, reg8.E),
  opcodes.BIT_bit_X.bind(undefined,0, reg8.H),
  opcodes.BIT_bit_X.bind(undefined,0, reg8.L),
  opcodes.BIT_bit_mXY.bind(undefined,0, reg8.H, reg8.L),
  opcodes.BIT_bit_X.bind(undefined,0, reg8.A),
  opcodes.BIT_bit_X.bind(undefined,1, reg8.B),
  opcodes.BIT_bit_X.bind(undefined,1, reg8.C),
  opcodes.BIT_bit_X.bind(undefined,1, reg8.D),
  opcodes.BIT_bit_X.bind(undefined,1, reg8.E),
  opcodes.BIT_bit_X.bind(undefined,1, reg8.H),
  opcodes.BIT_bit_X.bind(undefined,1, reg8.L),
  opcodes.BIT_bit_mXY.bind(undefined,1, reg8.H, reg8.L),
  opcodes.BIT_bit_X.bind(undefined,1, reg8.A),
  //0x50
  opcodes.BIT_bit_X.bind(undefined,2, reg8.B),
  opcodes.BIT_bit_X.bind(undefined,2, reg8.C),
  opcodes.BIT_bit_X.bind(undefined,2, reg8.D),
  opcodes.BIT_bit_X.bind(undefined,2, reg8.E),
  opcodes.BIT_bit_X.bind(undefined,2, reg8.H),
  opcodes.BIT_bit_X.bind(undefined,2, reg8.L),
  opcodes.BIT_bit_mXY.bind(undefined,2, reg8.H, reg8.L),
  opcodes.BIT_bit_X.bind(undefined,2, reg8.A),
  opcodes.BIT_bit_X.bind(undefined,3, reg8.B),
  opcodes.BIT_bit_X.bind(undefined,3, reg8.C),
  opcodes.BIT_bit_X.bind(undefined,3, reg8.D),
  opcodes.BIT_bit_X.bind(undefined,3, reg8.E),
  opcodes.BIT_bit_X.bind(undefined,3, reg8.H),
  opcodes.BIT_bit_X.bind(undefined,3, reg8.L),
  opcodes.BIT_bit_mXY.bind(undefined,3, reg8.H, reg8.L),
  opcodes.BIT_bit_X.bind(undefined,3, reg8.A),
  //0x60
  opcodes.BIT_bit_X.bind(undefined,4, reg8.B),
  opcodes.BIT_bit_X.bind(undefined,4, reg8.C),
  opcodes.BIT_bit_X.bind(undefined,4, reg8.D),
  opcodes.BIT_bit_X.bind(undefined,4, reg8.E),
  opcodes.BIT_bit_X.bind(undefined,4, reg8.H),
  opcodes.BIT_bit_X.bind(undefined,4, reg8.L),
  opcodes.BIT_bit_mXY.bind(undefined,4, reg8.H, reg8.L),
  opcodes.BIT_bit_X.bind(undefined,4, reg8.A),
  opcodes.BIT_bit_X.bind(undefined,5, reg8.B),
  opcodes.BIT_bit_X.bind(undefined,5, reg8.C),
  opcodes.BIT_bit_X.bind(undefined,5, reg8.D),
  opcodes.BIT_bit_X.bind(undefined,5, reg8.E),
  opcodes.BIT_bit_X.bind(undefined,5, reg8.H),
  opcodes.BIT_bit_X.bind(undefined,5, reg8.L),
  opcodes.BIT_bit_mXY.bind(undefined,5, reg8.H, reg8.L),
  opcodes.BIT_bit_X.bind(undefined,5, reg8.A),
  //0x70
  opcodes.BIT_bit_X.bind(undefined,6, reg8.B),
  opcodes.BIT_bit_X.bind(undefined,6, reg8.C),
  opcodes.BIT_bit_X.bind(undefined,6, reg8.D),
  opcodes.BIT_bit_X.bind(undefined,6, reg8.E),
  opcodes.BIT_bit_X.bind(undefined,6, reg8.H),
  opcodes.BIT_bit_X.bind(undefined,6, reg8.L),
  opcodes.BIT_bit_mXY.bind(undefined,6, reg8.H, reg8.L),
  opcodes.BIT_bit_X.bind(undefined,6, reg8.A),
  opcodes.BIT_bit_X.bind(undefined,7, reg8.B),
  opcodes.BIT_bit_X.bind(undefined,7, reg8.C),
  opcodes.BIT_bit_X.bind(undefined,7, reg8.D),
  opcodes.BIT_bit_X.bind(undefined,7, reg8.E),
  opcodes.BIT_bit_X.bind(undefined,7, reg8.H),
  opcodes.BIT_bit_X.bind(undefined,7, reg8.L),
  opcodes.BIT_bit_mXY.bind(undefined,7, reg8.H, reg8.L),
  opcodes.BIT_bit_X.bind(undefined,7, reg8.A),
  //0x80
  opcodes.RES_bit_X.bind(undefined,0,reg8.B),
  opcodes.RES_bit_X.bind(undefined,0, reg8.C),
  opcodes.RES_bit_X.bind(undefined,0, reg8.D),
  opcodes.RES_bit_X.bind(undefined,0, reg8.E),
  opcodes.RES_bit_X.bind(undefined,0, reg8.H),
  opcodes.RES_bit_X.bind(undefined,0, reg8.L),
  opcodes.RES_bit_mXY.bind(undefined,0, reg8.H, reg8.L),
  opcodes.RES_bit_X.bind(undefined,0, reg8.A),
  opcodes.RES_bit_X.bind(undefined,1, reg8.B),
  opcodes.RES_bit_X.bind(undefined,1, reg8.C),
  opcodes.RES_bit_X.bind(undefined,1, reg8.D),
  opcodes.RES_bit_X.bind(undefined,1, reg8.E),
  opcodes.RES_bit_X.bind(undefined,1, reg8.H),
  opcodes.RES_bit_X.bind(undefined,1, reg8.L),
  opcodes.RES_bit_mXY.bind(undefined,1, reg8.H, reg8.L),
  opcodes.RES_bit_X.bind(undefined,1, reg8.A),
  //0x90
  opcodes.RES_bit_X.bind(undefined,2, reg8.B),
  opcodes.RES_bit_X.bind(undefined,2, reg8.C),
  opcodes.RES_bit_X.bind(undefined,2, reg8.D),
  opcodes.RES_bit_X.bind(undefined,2, reg8.E),
  opcodes.RES_bit_X.bind(undefined,2, reg8.H),
  opcodes.RES_bit_X.bind(undefined,2, reg8.L),
  opcodes.RES_bit_mXY.bind(undefined,2, reg8.H, reg8.L),
  opcodes.RES_bit_X.bind(undefined,2, reg8.A),
  opcodes.RES_bit_X.bind(undefined,3, reg8.B),
  opcodes.RES_bit_X.bind(undefined,3, reg8.C),
  opcodes.RES_bit_X.bind(undefined,3, reg8.D),
  opcodes.RES_bit_X.bind(undefined,3, reg8.E),
  opcodes.RES_bit_X.bind(undefined,3, reg8.H),
  opcodes.RES_bit_X.bind(undefined,3, reg8.L),
  opcodes.RES_bit_mXY.bind(undefined,3, reg8.H, reg8.L),
  opcodes.RES_bit_X.bind(undefined,3, reg8.A),
  //0xA0
  opcodes.RES_bit_X.bind(undefined,4, reg8.B),
  opcodes.RES_bit_X.bind(undefined,4, reg8.C),
  opcodes.RES_bit_X.bind(undefined,4, reg8.D),
  opcodes.RES_bit_X.bind(undefined,4, reg8.E),
  opcodes.RES_bit_X.bind(undefined,4, reg8.H),
  opcodes.RES_bit_X.bind(undefined,4, reg8.L),
  opcodes.RES_bit_mXY.bind(undefined,4, reg8.H, reg8.L),
  opcodes.RES_bit_X.bind(undefined,4, reg8.A),
  opcodes.RES_bit_X.bind(undefined,5, reg8.B),
  opcodes.RES_bit_X.bind(undefined,5, reg8.C),
  opcodes.RES_bit_X.bind(undefined,5, reg8.D),
  opcodes.RES_bit_X.bind(undefined,5, reg8.E),
  opcodes.RES_bit_X.bind(undefined,5, reg8.H),
  opcodes.RES_bit_X.bind(undefined,5, reg8.L),
  opcodes.RES_bit_mXY.bind(undefined,5, reg8.H, reg8.L),
  opcodes.RES_bit_X.bind(undefined,5, reg8.A),
  //0xB0
  opcodes.RES_bit_X.bind(undefined,6, reg8.B),
  opcodes.RES_bit_X.bind(undefined,6, reg8.C),
  opcodes.RES_bit_X.bind(undefined,6, reg8.D),
  opcodes.RES_bit_X.bind(undefined,6, reg8.E),
  opcodes.RES_bit_X.bind(undefined,6, reg8.H),
  opcodes.RES_bit_X.bind(undefined,6, reg8.L),
  opcodes.RES_bit_mXY.bind(undefined,6, reg8.H, reg8.L),
  opcodes.RES_bit_X.bind(undefined,6, reg8.A),
  opcodes.RES_bit_X.bind(undefined,7, reg8.B),
  opcodes.RES_bit_X.bind(undefined,7, reg8.C),
  opcodes.RES_bit_X.bind(undefined,7, reg8.D),
  opcodes.RES_bit_X.bind(undefined,7, reg8.E),
  opcodes.RES_bit_X.bind(undefined,7, reg8.H),
  opcodes.RES_bit_X.bind(undefined,7, reg8.L),
  opcodes.RES_bit_mXY.bind(undefined,7, reg8.H, reg8.L),
  opcodes.RES_bit_X.bind(undefined,7, reg8.A),
  //0xC0
  opcodes.SET_bit_X.bind(undefined,0,reg8.B),
  opcodes.SET_bit_X.bind(undefined,0, reg8.C),
  opcodes.SET_bit_X.bind(undefined,0, reg8.D),
  opcodes.SET_bit_X.bind(undefined,0, reg8.E),
  opcodes.SET_bit_X.bind(undefined,0, reg8.H),
  opcodes.SET_bit_X.bind(undefined,0, reg8.L),
  opcodes.SET_bit_mXY.bind(undefined,0, reg8.H, reg8.L),
  opcodes.SET_bit_X.bind(undefined,0, reg8.A),
  opcodes.SET_bit_X.bind(undefined,1, reg8.B),
  opcodes.SET_bit_X.bind(undefined,1, reg8.C),
  opcodes.SET_bit_X.bind(undefined,1, reg8.D),
  opcodes.SET_bit_X.bind(undefined,1, reg8.E),
  opcodes.SET_bit_X.bind(undefined,1, reg8.H),
  opcodes.SET_bit_X.bind(undefined,1, reg8.L),
  opcodes.SET_bit_mXY.bind(undefined,1, reg8.H, reg8.L),
  opcodes.SET_bit_X.bind(undefined,1, reg8.A),
  //0xD0
  opcodes.SET_bit_X.bind(undefined,2, reg8.B),
  opcodes.SET_bit_X.bind(undefined,2, reg8.C),
  opcodes.SET_bit_X.bind(undefined,2, reg8.D),
  opcodes.SET_bit_X.bind(undefined,2, reg8.E),
  opcodes.SET_bit_X.bind(undefined,2, reg8.H),
  opcodes.SET_bit_X.bind(undefined,2, reg8.L),
  opcodes.SET_bit_mXY.bind(undefined,2, reg8.H, reg8.L),
  opcodes.SET_bit_X.bind(undefined,2, reg8.A),
  opcodes.SET_bit_X.bind(undefined,3, reg8.B),
  opcodes.SET_bit_X.bind(undefined,3, reg8.C),
  opcodes.SET_bit_X.bind(undefined,3, reg8.D),
  opcodes.SET_bit_X.bind(undefined,3, reg8.E),
  opcodes.SET_bit_X.bind(undefined,3, reg8.H),
  opcodes.SET_bit_X.bind(undefined,3, reg8.L),
  opcodes.SET_bit_mXY.bind(undefined,3, reg8.H, reg8.L),
  opcodes.SET_bit_X.bind(undefined,3, reg8.A),
  //0xE0
  opcodes.SET_bit_X.bind(undefined,4, reg8.B),
  opcodes.SET_bit_X.bind(undefined,4, reg8.C),
  opcodes.SET_bit_X.bind(undefined,4, reg8.D),
  opcodes.SET_bit_X.bind(undefined,4, reg8.E),
  opcodes.SET_bit_X.bind(undefined,4, reg8.H),
  opcodes.SET_bit_X.bind(undefined,4, reg8.L),
  opcodes.SET_bit_mXY.bind(undefined,4, reg8.H, reg8.L),
  opcodes.SET_bit_X.bind(undefined,4, reg8.A),
  opcodes.SET_bit_X.bind(undefined,5, reg8.B),
  opcodes.SET_bit_X.bind(undefined,5, reg8.C),
  opcodes.SET_bit_X.bind(undefined,5, reg8.D),
  opcodes.SET_bit_X.bind(undefined,5, reg8.E),
  opcodes.SET_bit_X.bind(undefined,5, reg8.H),
  opcodes.SET_bit_X.bind(undefined,5, reg8.L),
  opcodes.SET_bit_mXY.bind(undefined,5, reg8.H, reg8.L),
  opcodes.SET_bit_X.bind(undefined,5, reg8.A),
  //0xF0
  opcodes.SET_bit_X.bind(undefined,6, reg8.B),
  opcodes.SET_bit_X.bind(undefined,6, reg8.C),
  opcodes.SET_bit_X.bind(undefined,6, reg8.D),
  opcodes.SET_bit_X.bind(undefined,6, reg8.E),
  opcodes.SET_bit_X.bind(undefined,6, reg8.H),
  opcodes.SET_bit_X.bind(undefined,6, reg8.L),
  opcodes.SET_bit_mXY.bind(undefined,6, reg8.H, reg8.L),
  opcodes.SET_bit_X.bind(undefined,6, reg8.A),
  opcodes.SET_bit_X.bind(undefined,7, reg8.B),
  opcodes.SET_bit_X.bind(undefined,7, reg8.C),
  opcodes.SET_bit_X.bind(undefined,7, reg8.D),
  opcodes.SET_bit_X.bind(undefined,7, reg8.E),
  opcodes.SET_bit_X.bind(undefined,7, reg8.H),
  opcodes.SET_bit_X.bind(undefined,7, reg8.L),
  opcodes.SET_bit_mXY.bind(undefined,7, reg8.H, reg8.L),
  opcodes.SET_bit_X.bind(undefined,7, reg8.A),
]