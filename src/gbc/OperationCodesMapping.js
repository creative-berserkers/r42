import * as opcodes from './OperationCodes'
import {reg8} from './Memory'

export default OperationCodesMapping = [
  //0X00
  opcodes.NOP,
  opcodes.LD_XY_d16.bind(undefined, reg8.B, reg8.C),
  opcodes.LD_XY_Z.bind(undefined, reg8.B, reg8.C, reg8.A),
  opcodes.INC_XY.bind(undefined, reg8.B, reg8.C),
  opcodes.INC_X.bind(undefined, reg8.B),
  opcodes.DEC_X.bind(undefined, reg8.B),
  opcodes.LD_X_d8.bind(undefined, reg8.B),
  opcodes.RLC_X.bind(undefined, reg8.A),
  opcodes.LD_a16_SP,
  opcodes.ADD_XY_ZQ.bind(undefined, reg8.H, reg8.L, reg8.B, reg8.C),
  opcodes.LD_X_YZ.bind(undefined, reg8.A, reg8.B, reg8.C),
  opcodes.DEC_XY.bind(undefined, reg8.B, reg8.C),
  opcodes.INC_X.bind(undefined, reg8.C),
  opcodes.DEC_X.bind(undefined, reg8.C),
  opcodes.LD_X_d8.bind(undefined, reg8.C),
  opcodes.RRC_X.bind(undefined, reg8.A),
  //0x10
  opcodes.STOP,
  opcodes.LD_XY_d16.bind(undefined, reg8.D, reg8.E),
  opcodes.LD_XY_Z.bind(undefined, reg8.D, reg8.E, reg8.A),
  opcodes.INC_XY.bind(undefined, reg8.D, reg8.E),
  opcodes.INC_X.bind(undefined, reg8.D),
  opcodes.DEC_X.bind(undefined, reg8.D),
  opcodes.LD_X_d8.bind(undefined, reg8.D),
  opcodes.RL_X.bind(undefined, reg8.A),
  opcodes.JR_r8,
  opcodes.ADD_XY_ZQ.bind(undefined, reg8.H, reg8.L, reg8.D, reg8.E),
  opcodes.LD_X_YZ.bind(undefined, reg8.A, reg8.D, reg8.E),
  opcodes.DEC_XY.bind(undefined, reg8.D, reg8.E),
  opcodes.INC_X.bind(undefined, reg8.E),
  opcodes.DEC_X.bind(undefined, reg8.E),
  opcodes.LD_X_d8.bind(undefined, reg8.E),
  opcodes.RRA
  //0x20
]