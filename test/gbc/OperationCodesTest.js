import * as opcodes from '../../src/gbc/OperationCodes'
import Memory,{reg8, flags} from './../../src/gbc/Memory'
import {expect} from 'chai'

function expectNumberOfCycle(cycle, memory){
  it(`should take ${cycle} cycle`,()=>{
    expect(memory.lastInstructionClock()).to.equal(cycle)
  })
}

function expectZeroFlag(flag, memory){
  it(`should set zero flag to ${flag}`,()=>{
    expect(memory.flag(flags.zero)).to.equal(flag)
  })
}

function expectSubtractFlag(flag, memory){
  it(`should set subtract flag to ${flag}`,()=>{
    expect(memory.flag(flags.subtract)).to.equal(flag)
  })
}

function expectHalfCarryFlag(flag, memory){
  it(`should set half carry flag to ${flag}`,()=>{
    expect(memory.flag(flags.halfCarry)).to.equal(flag)
  })
}

function expectCarryFlag(flag, memory){
  it(`should set carry flag to ${flag}`,()=>{
    expect(memory.flag(flags.carry)).to.equal(flag)
  })
}

describe('Operation codes test', ()=>{
  describe('NOP', ()=> {
    const memory = Memory.createEmptyMemory()
    opcodes.NOP(memory)

    expectNumberOfCycle(1,memory)
  })

  describe('LD_XY_d16',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0001)
    memory.setReg8(reg8.B, 0)
    memory.setReg8(reg8.C, 0)
    memory.writeByte(0x0001, 14)
    memory.writeByte(0x0002, 19)

    opcodes.LD_XY_d16(reg8.B,reg8.C, memory)

    it('should load memory[PC] to Y register',()=>{
      expect(memory.reg8(reg8.C)).to.equal(14)
    })
    it('should load memory[PC+1] to X register',()=>{
      expect(memory.reg8(reg8.B)).to.equal(19)
    })
    it('should increase PC by 2',()=>{
      expect(memory.PC()).to.equal(3)
    })
    expectNumberOfCycle(3,memory)
  })

  describe('LD_mXY_Z',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.B, 0)
    memory.setReg8(reg8.C, 1)
    memory.setReg8(reg8.A, 18)
    memory.writeByte(0x0001, 0)

    opcodes.LD_mXY_Z(reg8.B,reg8.C, reg8.A, memory)

    it('should write into memory[X<<8+Y] value from Z',()=>{
      expect(memory.readByte(0x0001)).to.equal(18)
    })

    expectNumberOfCycle(2, memory)
  })

  describe('INC_XY',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.B, 255)
    memory.setReg8(reg8.C, 255)

    opcodes.INC_XY(reg8.B,reg8.C, memory)

    it('should increment value stored in XY by 1 and respect overflow',()=>{
      expect(memory.reg8(reg8.B)).to.equal(0)
      expect(memory.reg8(reg8.C)).to.equal(0)
    })

    expectNumberOfCycle(2, memory)
  })

  describe('INC_X', ()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.B, 15)

    opcodes.INC_X(reg8.B, memory)

    it('should increment X by 1',()=>{
      expect(memory.reg8(reg8.B)).to.equal(16)
    })

    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(true, memory)
    expectNumberOfCycle(1, memory)
  })

  describe('DEC_X',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.B, 0)
    opcodes.DEC_X(reg8.B, memory)

    it('should decrement X',()=>{
      expect(memory.reg8(reg8.B)).to.equal(255)
    })

    expectZeroFlag(false, memory)
    expectSubtractFlag(true, memory)
    expectHalfCarryFlag(true, memory)
    expectNumberOfCycle(1, memory)
  })

  describe('LD_X_d8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0001)
    memory.setReg8(reg8.B, 0)
    memory.writeByte(0x0001, 29)

    opcodes.LD_X_d8(reg8.B, memory)
    it('should load memory[PC] into register X',()=>{
      expect(memory.reg8(reg8.B)).to.equal(29)
    })

    it('should increase PC by 1',()=>{
      expect(memory.PC()).to.equal(2)
    })

    expectNumberOfCycle(2,memory)
  })

  describe('RLC_X',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 130)
    memory.setFlag(flags.zero, true)
    memory.setFlag(flags.subtract, true)
    memory.setFlag(flags.halfCarry, true)
    memory.setFlag(flags.carry, false)

    opcodes.RLC_X(reg8.A, memory)

    it('should rotate register X to the left respecting carry',()=>{
      expect(memory.reg8(reg8.A)).to.equal(5)
    })

    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(false, memory)
    expectCarryFlag(true, memory)
    expectNumberOfCycle(1,memory)
  })

  describe('LD_a16_SP',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0001)
    memory.setSP(17)
    memory.writeByte(0x0001, 0x03)
    memory.writeByte(0x0002, 0x00)
    memory.writeByte(0x0003, 0x00)
    memory.writeByte(0x0004, 0x00)

    opcodes.LD_a16_SP(memory)

    it('should copy to memory[memory[PC]] value from SP',()=>{
      expect(memory.readWord(0x0003)).to.equal(4352) //check this
    })

    expectNumberOfCycle(5, memory)
  })

  describe('ADD_XY_ZQ',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.H, 15)
    memory.setReg8(reg8.L, 255)
    memory.setReg8(reg8.B, 0)
    memory.setReg8(reg8.C, 1)

    opcodes.ADD_XY_ZQ(reg8.H, reg8.L, reg8.B, reg8.C, memory)

    it('should add XY to ZQ and store result in XY',()=>{
      expect(memory.reg8(reg8.H)).to.equal(16)
      expect(memory.reg8(reg8.L)).to.equal(0)
    })
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('LD_X_mYZ',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 0)
    memory.setReg8(reg8.B, 0)
    memory.setReg8(reg8.C, 1)
    memory.writeByte(0x0001, 35)

    opcodes.LD_X_mYZ(reg8.A, reg8.B, reg8.C, memory)

    it('should load memory[YZ] and store it into X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(35)
    })
    expectNumberOfCycle(2, memory)
  })

  describe('DEC_XY',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.B, 0)
    memory.setReg8(reg8.C, 0)
    opcodes.DEC_XY(reg8.B, reg8.C, memory)

    it('should decrement XY by 1',()=>{
      expect(memory.reg8(reg8.B)).to.equal(255)
      expect(memory.reg8(reg8.C)).to.equal(255)
    })
    expectNumberOfCycle(2, memory)
  })

  describe('RRC_X',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 129)
    memory.setFlag(flags.zero, true)
    memory.setFlag(flags.subtract, true)
    memory.setFlag(flags.halfCarry, true)
    memory.setFlag(flags.carry, false)

    opcodes.RRC_X(reg8.A, memory)
    it('should rotate register X to the right respecting carry',()=>{
      expect(memory.reg8(reg8.A)).to.equal(192)
    })
  })

  describe('STOP',()=>{
    const memory = Memory.createEmptyMemory()

    opcodes.STOP(memory)
    it('should set stop flag',()=>{
      expect(memory.flag(flags.stop)).to.equal(true)
    })
    expectNumberOfCycle(1, memory)
  })

  describe('RL_X',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 130)
    memory.setFlag(flags.zero, true)
    memory.setFlag(flags.subtract, true)
    memory.setFlag(flags.halfCarry, true)
    memory.setFlag(flags.carry, true)

    opcodes.RL_X(reg8.A, memory)
    it('should rotate register X to the left',()=>{
      expect(memory.reg8(reg8.A)).to.equal(5)
    })
    expectNumberOfCycle(1,memory)
  })

  describe('JR_r8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0001)
    memory.writeByte(0x0001,3)

    opcodes.JR_r8(memory)
    it('should increase PC by memory[PC]',()=>{
      expect(memory.PC()).to.equal(5)
    })
    expectNumberOfCycle(3, memory)
  })

  describe('RR_X',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, parseInt('10000010', 2))
    memory.setFlag(flags.zero, true)
    memory.setFlag(flags.subtract, true)
    memory.setFlag(flags.halfCarry, true)
    memory.setFlag(flags.carry, true)

    opcodes.RR_X(reg8.A, memory)
    it('should rotate register right',()=>{
      expect(memory.reg8(reg8.A)).to.equal(parseInt('11000001',2))
    })
    expectNumberOfCycle(1, memory)
  })

  describe('JR_SF_r8',()=>{
    describe('with zero flag === false',()=>{
      const memory = Memory.createEmptyMemory()
      memory.setPC(0x0002)
      memory.writeByte(0x0002,4)
      memory.setFlag(flags.zero, false)

      opcodes.JR_SF_r8(false, flags.zero, memory)
      it('should increase PC by memory[PC] when zero flag is set to false',()=>{
        expect(memory.PC()).to.equal(7)
      })
      expectNumberOfCycle(3,memory)
    })

    describe('with zero flag === true',()=>{
      const memory = Memory.createEmptyMemory()
      memory.setPC(0x0002)
      memory.writeByte(0x0002,4)
      memory.setFlag(flags.zero, true)

      opcodes.JR_SF_r8(false, flags.zero, memory)
      it('should increase PC by memory[PC] when zero flag is set to true',()=>{

        expect(memory.PC()).to.equal(3)
      })
      expectNumberOfCycle(2,memory)
    })
  })

  describe('LD_N_mXY_Z',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A,45)
    memory.setReg8(reg8.H,0)
    memory.setReg8(reg8.L,1)
    memory.writeByte(0x0001,0)

    opcodes.LD_N_mXY_Z(1,reg8.H, reg8.L, reg8.A, memory)
    it('should load into memory[XY] value from Z',()=>{
      expect(memory.readByte(0x0001)).to.equal(45)
    })
    it('should increase XY by 1',()=>{
      expect(memory.reg8(reg8.H)).to.equal(0)
      expect(memory.reg8(reg8.L)).to.equal(2)
    })
    expectNumberOfCycle(2, memory)
  })

  describe('DAX',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 0x3C)
    memory.setFlag(flags.zero, false)
    memory.setFlag(flags.subtract, false)
    memory.setFlag(flags.halfCarry, true)
    memory.setFlag(flags.carry, false)


    opcodes.DAX(reg8.A, memory)
    it('should correct BCD value stored in register X respecting flags',()=>{
      expect(memory.reg8(reg8.A)).to.equal(0x42)
    })
    expectNumberOfCycle(1, memory)
  })

  describe('LD_N_X_mYZ',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A,0)
    memory.setReg8(reg8.H,0)
    memory.setReg8(reg8.L,1)
    memory.writeByte(0x0001,56)

    opcodes.LD_N_X_mYZ( 1,reg8.A, reg8.H, reg8.L, memory)
    it('should load into Z memory[XY]',()=>{
      expect(memory.reg8(reg8.A)).to.equal(56)
    })
    it('should increase XY by 1',()=>{
      expect(memory.reg8(reg8.H)).to.equal(0)
      expect(memory.reg8(reg8.L)).to.equal(2)
    })
    expectNumberOfCycle(2, memory)
  })

  describe('CPL_X',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A,232)
    memory.setFlag(flags.subtract, false)
    memory.setFlag(flags.halfCarry, false)

    opcodes.CPL_X(reg8.A, memory)
    it('should XOR the register X with value 0xFF',()=>{
      expect(memory.reg8(reg8.A)).to.equal(23)
    })
    expectSubtractFlag(true, memory)
    expectHalfCarryFlag(true, memory)
    expectNumberOfCycle(1, memory)
  })

  describe('INC_mXY',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.H,0x00)
    memory.setReg8(reg8.L,0x01)
    memory.writeByte(0x0001, 15)
    memory.setFlag(flags.zero, false)
    memory.setFlag(flags.subtract, false)
    memory.setFlag(flags.halfCarry, false)

    opcodes.INC_mXY(reg8.H,reg8.L, memory)

    it('should increment value at memory[XY] by 1',()=>{
      expect(memory.readByte(0x0001)).to.equal(16)
    })
    expectZeroFlag(false, memory)
    expectHalfCarryFlag(true, memory)
    expectSubtractFlag(false, memory)
    expectNumberOfCycle(3, memory)
  })

  describe('DEC_mXY',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.H,0x00)
    memory.setReg8(reg8.L,0x01)
    memory.writeByte(0x0001, 0)
    memory.setFlag(flags.zero, false)
    memory.setFlag(flags.subtract, false)
    memory.setFlag(flags.halfCarry, false)

    opcodes.DEC_mXY(reg8.H,reg8.L, memory)

    it('should decrement value at memory[XY] by 1',()=>{
      expect(memory.readByte(0x0001)).to.equal(255)
    })
    expectZeroFlag(false, memory)
    expectHalfCarryFlag(true, memory)
    expectSubtractFlag(true, memory)
    expectNumberOfCycle(3, memory)
  })

  describe('LD_mXY_d8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0000)
    memory.setReg8(reg8.H,0x00)
    memory.setReg8(reg8.L,0x01)
    memory.writeByte(0x0000, 99)
    memory.writeByte(0x0001, 0)

    opcodes.LD_mXY_d8(reg8.H, reg8.L, memory)
    it('should load into memory[XY] value from memory[PC]',()=>{
      expect(memory.readByte(0x0001)).to.equal(99)
    })
    expectNumberOfCycle(3, memory)
  })

  describe('SCF',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setFlag(flags.carry, false)
    memory.setFlag(flags.halfCarry, true)
    memory.setFlag(flags.subtract, true)

    opcodes.SCF(memory)

    expectCarryFlag(true, memory)
    expectHalfCarryFlag(false, memory)
    expectSubtractFlag(false, memory)
  })

  describe('CCF',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setFlag(flags.carry, false)
    memory.setFlag(flags.halfCarry, true)
    memory.setFlag(flags.subtract, true)

    opcodes.CCF(memory)

    expectCarryFlag(true, memory)
    expectHalfCarryFlag(false, memory)
    expectSubtractFlag(false, memory)
  })

  describe('LD_X_Y',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.C, 0x45)
    memory.setReg8(reg8.B, 0x00)

    opcodes.LD_X_Y(reg8.B, reg8.C, memory)
    it('should load Y into X',()=>{
      expect(memory.reg8(reg8.B)).to.equal(0x45)
    })
    expectNumberOfCycle(1, memory)
  })

  describe('HALT',()=>{
    const memory = Memory.createEmptyMemory()

    opcodes.HALT(memory)
    it('should set halt flag',()=>{
      expect(memory.flag(flags.halt)).to.equal(true)
    })
    expectNumberOfCycle(1, memory)
  })

  describe('ADD_X_Y',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 10)
    memory.setReg8(reg8.B, 6)

    opcodes.ADD_X_Y(reg8.A, reg8.B, memory)
    it('should add X to Y and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(16)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(1, memory)
  })

  describe('ADD_X_mYZ',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 10)
    memory.setReg8(reg8.H, 0)
    memory.setReg8(reg8.L, 1)
    memory.writeByte(0x0001,6)


    opcodes.ADD_X_mYZ(reg8.A, reg8.H, reg8.L, memory)
    it('should add X to memory[YZ] and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(16)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('ADC_X_Y',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 10)
    memory.setReg8(reg8.B, 5)
    memory.setFlag(flags.carry, true)

    opcodes.ADC_X_Y(reg8.A, reg8.B, memory)
    it('should add X to Y respecting carry flag and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(16)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(1, memory)
  })

  describe('ADC_X_mYZ',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 10)
    memory.setReg8(reg8.H, 0)
    memory.setReg8(reg8.L, 1)
    memory.writeByte(0x0001,5)
    memory.setFlag(flags.carry, true)

    opcodes.ADC_X_mYZ(reg8.A, reg8.H, reg8.L, memory)
    it('should add X to memory[YZ] respecting carry flag and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(16)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('SUB_X_Y',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 0)
    memory.setReg8(reg8.B, 1)

    opcodes.SUB_X_Y(reg8.A, reg8.B, memory)
    it('should subtract Y from X and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(255)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(true, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(true, memory)
    expectNumberOfCycle(1, memory)
  })

  describe('SUB_X_mYZ',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 0)
    memory.setReg8(reg8.H, 0x00)
    memory.setReg8(reg8.L, 0x01)
    memory.writeByte(0x0001, 1)

    opcodes.SUB_X_mYZ(reg8.A, reg8.H,reg8.L, memory)
    it('should subtract Y from X and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(255)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(true, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(true, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('SBC_X_Y',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 0)
    memory.setReg8(reg8.B, 0)
    memory.setFlag(flags.carry, true)

    opcodes.SBC_X_Y(reg8.A, reg8.B, memory)
    it('should subtract Y from X respecting carry flag and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(255)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(true, memory)
    expectHalfCarryFlag(false, memory)
    expectCarryFlag(true, memory)
    expectNumberOfCycle(1, memory)
  })

  describe('SBC_X_mYZ',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 2)
    memory.setReg8(reg8.H, 0x00)
    memory.setReg8(reg8.L, 0x01)
    memory.writeByte(0x0001, 2)
    memory.setFlag(flags.carry, true)

    opcodes.SBC_X_mYZ(reg8.A, reg8.H, reg8.L, memory)
    it('should subtract memory[YZ] from X respecting carry flag and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(255)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(true, memory)
    expectHalfCarryFlag(false, memory)
    expectCarryFlag(true, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('AND_X_Y',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 2)
    memory.setReg8(reg8.B, 3)

    opcodes.AND_X_Y(reg8.A, reg8.B, memory)
    it('should AND X with Y and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(2)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(1, memory)
  })

  describe('AND_X_mYZ',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 2)
    memory.setReg8(reg8.H, 0x00)
    memory.setReg8(reg8.L, 0x01)
    memory.writeByte(0x0001, 3)

    opcodes.AND_X_mYZ(reg8.A, reg8.H, reg8.L, memory)
    it('should subtract X with memory[YZ] and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(2)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('XOR_X_Y',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 2)
    memory.setReg8(reg8.B, 3)

    opcodes.XOR_X_Y(reg8.A, reg8.B, memory)
    it('should XOR X with Y and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(1)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(false, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(1, memory)
  })

  describe('XOR_X_mYZ',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 2)
    memory.setReg8(reg8.H, 0x00)
    memory.setReg8(reg8.L, 0x01)
    memory.writeByte(0x0001, 3)

    opcodes.XOR_X_mYZ(reg8.A, reg8.H, reg8.L, memory)
    it('should XOR X with memory[YZ] and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(1)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(false, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('OR_X_Y',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 2)
    memory.setReg8(reg8.B, 3)

    opcodes.OR_X_Y(reg8.A, reg8.B, memory)
    it('should OR X with Y and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(3)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(false, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(1, memory)
  })

  describe('OR_X_mYZ',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 2)
    memory.setReg8(reg8.H, 0x00)
    memory.setReg8(reg8.L, 0x01)
    memory.writeByte(0x0001, 3)

    opcodes.OR_X_mYZ(reg8.A, reg8.H, reg8.L, memory)
    it('should OR X with memory[YZ] and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(3)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(false, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('CP_X_Y',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 5)
    memory.setReg8(reg8.H, 0x00)
    memory.setReg8(reg8.L, 0x01)
    memory.writeByte(0x0001, 3)

    opcodes.CP_X_mYZ(reg8.A, reg8.H, reg8.L, memory)
    it('should subtract Y from X without modifying X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(5)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(true, memory)
    expectHalfCarryFlag(false, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('CP_X_Y',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 5)
    memory.setReg8(reg8.B, 3)

    opcodes.CP_X_Y(reg8.A, reg8.B, memory)
    it('should subtract memory[YZ] from X without modifying X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(5)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(true, memory)
    expectHalfCarryFlag(false, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(1, memory)
  })

  describe('RET_S_F',()=>{
    describe('with zero flag === false',()=>{
      const memory = Memory.createEmptyMemory()
      memory.setPC(0x0002)
      memory.setSP(0x0010)
      memory.writeByte(0x0010,0x00)
      memory.writeByte(0x0011,0x04)
      memory.setFlag(flags.zero, false)

      opcodes.RET_S_F(false, flags.zero, memory)
      it('should increase PC by memory[SP] when zero flag is set to false',()=>{
        expect(memory.PC()).to.equal(4)
      })
      it('should increase SP by 2 when zero flag is set to false',()=>{
        expect(memory.SP()).to.equal(0x0012)
      })
      expectNumberOfCycle(5,memory)
    })

    describe('with zero flag === true',()=>{
      const memory = Memory.createEmptyMemory()
      memory.setPC(0x0002)
      memory.setSP(0x0010)
      memory.writeByte(0x0010,0x00)
      memory.writeByte(0x0010,0x04)
      memory.setFlag(flags.zero, false)

      opcodes.RET_S_F(true, flags.zero, memory)
      it('should not increase PC by memory[PC] when zero flag is set to true',()=>{
        expect(memory.PC()).to.equal(2)
      })
      it('should not change SP',()=>{
        expect(memory.SP()).to.equal(0x0010)
      })
      expectNumberOfCycle(2,memory)
    })
  })

  describe('POP_X_Y',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.B, 0)
    memory.setReg8(reg8.C, 0)
    memory.setSP(0x10)
    memory.writeByte(0x10, 4)
    memory.writeByte(0x11, 5)

    opcodes.POP_X_Y(reg8.B, reg8.C, memory)
    it('should POP memory[SP] to registers XY',()=>{
      expect(memory.reg8(reg8.B)).to.equal(5)
      expect(memory.reg8(reg8.C)).to.equal(4)
    })
    expectNumberOfCycle(3, memory)
  })

  describe('JP_S_F_a16',()=>{
    describe('with zero flag === false',()=>{
      const memory = Memory.createEmptyMemory()
      memory.setPC(0x0002)
      memory.writeByte(0x0002,0x00)
      memory.writeByte(0x0003,0x04)
      memory.setFlag(flags.zero, false)

      opcodes.JP_S_F_a16(false, flags.zero, memory)
      it('should increase PC by memory[PC] when zero flag is set to false',()=>{
        expect(memory.PC()).to.equal(4)
      })
      expectNumberOfCycle(4,memory)
    })

    describe('with zero flag === true',()=>{
      const memory = Memory.createEmptyMemory()
      memory.setPC(0x0002)
      memory.writeByte(0x0002,0x00)
      memory.writeByte(0x0002,0x04)
      memory.setFlag(flags.zero, false)

      opcodes.JP_S_F_a16(true, flags.zero, memory)
      it('should not increase PC by memory[PC] when zero flag is set to true',()=>{
        expect(memory.PC()).to.equal(2)
      })
      expectNumberOfCycle(3,memory)
    })
  })

  describe('JP_a16',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0004)
    memory.writeWord(0x0004, 0x0006)

    opcodes.JP_a16(memory)
    it('should set PC to memory[PC]',()=>{
      expect(memory.PC()).to.equal(0x0006)
    })
    expectNumberOfCycle(3, memory)
  })

  describe('CALL_S_F_a16',()=>{
    describe('with zero flag === false',()=>{
      const memory = Memory.createEmptyMemory()
      memory.setPC(0x0002)
      memory.setSP(0x0010)
      memory.writeByte(0x0002,0x00)
      memory.writeByte(0x0003,0x04)
      memory.setFlag(flags.zero, false)

      opcodes.CALL_S_F_a16(false, flags.zero, memory)
      it('should set PC to memory[PC] when zero flag is set to false',()=>{
        expect(memory.PC()).to.equal(4)
      })
      it('should push PC to memory[SP] when zero flag is set to false',()=>{
        expect(memory.readByte(0x0010 -1)).to.equal(0x00)
        expect(memory.readByte(0x0010 -2)).to.equal(0x04)
      })
      it('should decrement SP by 2 when zero flag is set to false',()=>{
        expect(memory.SP()).to.equal(0x0010 - 2)
      })
      expectNumberOfCycle(6,memory)
    })

    describe('with zero flag === false',()=>{
      const memory = Memory.createEmptyMemory()
      memory.setPC(0x0002)
      memory.setSP(0x0010)
      memory.writeByte(0x0002,0x00)
      memory.writeByte(0x0003,0x04)
      memory.setFlag(flags.zero, true)

      opcodes.CALL_S_F_a16(false, flags.zero, memory)
      it('should increase PC by 2 when zero flag is set to false',()=>{
        expect(memory.PC()).to.equal(0x0004)
      })
      it('should not change SP when zero flag is set to false',()=>{
        expect(memory.SP()).to.equal(0x0010)
      })
      expectNumberOfCycle(2,memory)
    })
  })

  describe('PUSH_X_Y',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.B, 4)
    memory.setReg8(reg8.C, 5)
    memory.setSP(0x12)
    memory.writeByte(0x10, 0)
    memory.writeByte(0x11, 0)

    opcodes.PUSH_X_Y(reg8.B, reg8.C, memory)
    it('should POP memory[SP] to registers XY',()=>{
      expect(memory.readByte(0x10)).to.equal(5)
      expect(memory.readByte(0x11)).to.equal(4)
    })
    expectNumberOfCycle(4, memory)
  })

  describe('ADD_X_d8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 10)
    memory.setPC(0x0002)
    memory.writeByte(0x0002, 6)
    memory.setFlag(flags.carry, true)

    opcodes.ADD_X_d8(reg8.A, memory)
    it('should add X to memory[PC] and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(16)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('RST_00H',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0504)
    memory.setSP(0x12)
    memory.writeByte(0x10, 0)
    memory.writeByte(0x11, 0)

    opcodes.RST_p( 0x0000, memory)
    it('should reset PC to 0x0000',()=>{
      expect(memory.PC()).to.equal(0x0000)
    })
    it('should PUSH PC to memory[SP]',()=>{
      expect(memory.readByte(0x10)).to.equal(4)
      expect(memory.readByte(0x11)).to.equal(5)
    })
    expectNumberOfCycle(4, memory)
  })

  describe('RET',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0002)
    memory.setSP(0x0010)
    memory.writeByte(0x0010, 0x04)
    memory.writeByte(0x0011, 0x00)

    opcodes.RET( memory)
    it('should set PC to 0x0004',()=>{
      expect(memory.PC()).to.equal(0x0004)
    })
    it('should increase SP by 2',()=>{
      expect(memory.SP()).to.equal(0x0012)
    })
    expectNumberOfCycle(4, memory)
  })

  describe('PREFIX_CB',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0001)
    memory.writeByte(0x0001, 0x01)

    const falseOpcodes = [
      (memory)=>{
        throw Error('Should not be called')
      },
      (memory)=>{
        memory.setLastInstructionClock(2)
      }
    ]

    opcodes.PREFIX_CB( falseOpcodes, memory)
    it('should increase PC by 1',()=>{
      expect(memory.PC()).to.equal(0x0002)
    })
    expectNumberOfCycle(2, memory)
  })

  describe('CALL_a16',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0002)
    memory.setSP(0x0010)
    memory.writeByte(0x0002,0x00)
    memory.writeByte(0x0003,0x04)

    opcodes.CALL_a16( memory)
    it('should set PC to memory[PC] when zero flag is set to false',()=>{
      expect(memory.PC()).to.equal(4)
    })
    it('should push PC to memory[SP] when zero flag is set to false',()=>{
      expect(memory.readByte(0x0010 -1)).to.equal(0x00)
      expect(memory.readByte(0x0010 -2)).to.equal(0x04)
    })
    it('should decrement SP by 2 when zero flag is set to false',()=>{
      expect(memory.SP()).to.equal(0x0010 - 2)
    })
    expectNumberOfCycle(6,memory)
  })

  describe('ADC_X_d8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 10)
    memory.setPC(0x0002)
    memory.writeByte(0x0002, 5)
    memory.setFlag(flags.carry, true)

    opcodes.ADC_X_d8(reg8.A, memory)
    it('should add X to memory[PC] respecting carry flag and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(16)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('ILLEGAL',()=>{
    const memory = Memory.createEmptyMemory()

    opcodes.ILLEGAL(memory)
    it('should set stop flag to true',()=>{
      expect(memory.flag(flags.stop)).to.equal(true)
    })
    it('should set illegal flag to true',()=>{
      expect(memory.flag(flags.illegal)).to.equal(true)
    })
  })

  describe('SUB_X_d8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 10)
    memory.setPC(0x0002)
    memory.writeByte(0x0002, 11)
    memory.setFlag(flags.carry, true)

    opcodes.SUB_X_d8(reg8.A, memory)
    it('should add X to memory[PC] and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(255)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(true, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(true, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('RETI',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0002)
    memory.setSP(0x0010)
    memory.writeByte(0x0010, 0x04)
    memory.writeByte(0x0011, 0x00)

    opcodes.RETI(memory)
    it('should set PC to 0x0004',()=>{
      expect(memory.PC()).to.equal(0x0004)
    })
    it('should increase SP by 2',()=>{
      expect(memory.SP()).to.equal(0x0012)
    })
    it('should set IRQEnableDelay to 2',()=>{
      expect(memory.IRQEnableDelay()).to.equal(2)
    })
    expectNumberOfCycle(4, memory)
  })

  describe('SBC_X_d8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 10)
    memory.setPC(0x0002)
    memory.writeByte(0x0002, 10)
    memory.setFlag(flags.carry, true)

    opcodes.SBC_X_d8(reg8.A, memory)
    it('should add X to memory[PC] respecting carry flag and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(255)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(true, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(true, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('LDH_ma8_X',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 0x14)
    memory.setPC(0x0002)
    memory.writeByte(0x0002, 0x10)

    opcodes.LDH_ma8_X(reg8.A, memory)
    it('should load into memory[0xFF00 + memory[PC]] value from X',()=>{
      expect(memory.readByte(0xFF00 + 0x0010)).to.equal(0x14)
    })
    it('should increase PC by 1',()=>{
      expect(memory.PC()).to.equal(0x0003)
    })
    expectNumberOfCycle(3, memory)
  })

  describe('LD_mX_Y',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 0x14)
    memory.setReg8(reg8.C, 0x10)

    opcodes.LD_mX_Y(reg8.C, reg8.A, memory)
    it('should load into memory[0xFF00 + X] value from Y',()=>{
      expect(memory.readByte(0xFF00 + 0x0010)).to.equal(0x14)
    })
    expectNumberOfCycle(2, memory)
  })

  describe('AND_X_d8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 2)
    memory.setPC(0x0002)
    memory.writeByte(0x0002, 3)

    opcodes.AND_X_d8(reg8.A, memory)
    it('should AND X with memory[PC] and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(2)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('ADD_SP_r8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setPC(0x0002)
    memory.setSP(0x0010)
    memory.writeByte(0x0002, 2)

    opcodes.ADD_SP_r8(memory)
    it('should ADD X SP to memory[PC] and store result in SP',()=>{
      expect(memory.SP()).to.equal(0x0012)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(false, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(4, memory)
  })

  describe('JP_mXY',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.H, 0x00)
    memory.setReg8(reg8.L, 0x03)
    memory.setPC(0x0000)

    opcodes.JP_mXY(reg8.H, reg8.L, memory)
    it('should set PC to memory[XY]',()=>{
      expect(memory.PC()).to.equal(0x0003)
    })
    expectNumberOfCycle(1, memory)
  })

  describe('LD_ma16_X',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 0x14)
    memory.setPC(0x0002)
    memory.writeByte(0x0002,0x10)
    memory.writeByte(0x0003,0x00)

    opcodes.LD_ma16_X(reg8.A, memory)
    it('should load into memory[PC] value from X',()=>{
      expect(memory.readByte(0x0010)).to.equal(0x14)
    })
    it('should increase PC by 2',()=>{
      expect(memory.PC()).to.equal(0x0004)
    })
    expectNumberOfCycle(4, memory)
  })

  describe('XOR_X_d8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 2)
    memory.setPC(0x0002)
    memory.writeByte(0x0002, 3)

    opcodes.XOR_X_d8(reg8.A, memory)
    it('should XOR X with memory[PC] and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(1)
    })
    it('should increase PC by 1',()=>{
      expect(memory.PC()).to.equal(0x0003)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(false, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('LDH_X_ma8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 0x10)
    memory.setPC(0x0002)
    memory.writeByte(0x0002, 0x14)
    memory.writeByte(0xFF14, 0x32)

    opcodes.LDH_X_ma8(reg8.A, memory)
    it('should load into X  value from memory[0xFF00 + memory[PC]]',()=>{
      expect(memory.reg8(reg8.A)).to.equal(0x32)
    })
    it('should increase PC by 1',()=>{
      expect(memory.PC()).to.equal(0x0003)
    })
    expectNumberOfCycle(3, memory)
  })

  describe('LD_X_mY',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 0x10)
    memory.setReg8(reg8.C, 0x14)

    memory.writeByte(0xFF14, 0x43)

    opcodes.LD_X_mY(reg8.A, reg8.C, memory)
    it('should load into X value from memory[0xFF00 + X]',()=>{
      expect(memory.reg8(reg8.A)).to.equal(0x43)
    })
    expectNumberOfCycle(2, memory)
  })

  describe('DI',()=>{
    const memory = Memory.createEmptyMemory()

    opcodes.DI(memory)
    it('should set IRQEnableDelay to 0',()=>{
      expect(memory.IRQEnableDelay()).to.equal(0)
    })
    it('should set ime flag to false',()=>{
      expect(memory.flag(flags.ime)).to.equal(false)
    })
    expectNumberOfCycle(1, memory)
  })

  describe('OR_X_d8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 2)
    memory.setPC(0x0002)
    memory.writeByte(0x0002, 3)

    opcodes.OR_X_d8(reg8.A, memory)
    it('should XOR X with memory[PC] and store result in X',()=>{
      expect(memory.reg8(reg8.A)).to.equal(3)
    })
    it('should increase PC by 1',()=>{
      expect(memory.PC()).to.equal(0x0003)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(false, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(2, memory)
  })

  describe('LD_XY_SP_r8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.H, 0x00)
    memory.setReg8(reg8.L, 0x00)
    memory.setPC(0x0002)
    memory.setSP(0x0004)
    memory.writeByte(0x0002, 3)

    opcodes.LD_XY_SP_r8(reg8.H, reg8.L, memory)
    it('should load SP+memory[PC] and store result in XY',()=>{
      expect(memory.reg8(reg8.H)).to.equal(0x00)
      expect(memory.reg8(reg8.L)).to.equal(0x07)
    })
    it('should increase PC by 1',()=>{
      expect(memory.PC()).to.equal(0x0003)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(false, memory)
    expectHalfCarryFlag(false, memory)
    expectCarryFlag(false, memory)
    expectNumberOfCycle(3, memory)
  })

  describe('LD_SP_XY',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.H, 0x00)
    memory.setReg8(reg8.L, 0x03)

    opcodes.LD_SP_XY(reg8.H, reg8.L, memory)
    it('should set SP to XY',()=>{
      expect(memory.SP()).to.equal(0x0003)
    })
    expectNumberOfCycle(2, memory)
  })

  describe('LD_X_ma16',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 0x00)
    memory.setPC(0x0002)
    memory.writeByte(0x0002, 0x07)
    memory.writeByte(0x0003, 0x00)
    memory.writeByte(0x0007, 0x24)

    opcodes.LD_X_ma16(reg8.A, memory)
    it('should set X to memory[memory[PC+1] | memory[PC]]',()=>{
      expect(memory.reg8(reg8.A)).to.equal(0x0024)
    })
    expectNumberOfCycle(4, memory)
  })

  describe('EI',()=>{
    const memory = Memory.createEmptyMemory()

    opcodes.EI(memory)
    it('should set IRQEnableDelay to 2',()=>{
      expect(memory.IRQEnableDelay()).to.equal(2)
    })
    expectNumberOfCycle(1, memory)
  })

  describe('CP_X_d8',()=>{
    const memory = Memory.createEmptyMemory()
    memory.setReg8(reg8.A, 2)
    memory.setPC(0x0002)
    memory.writeByte(0x0002, 3)

    opcodes.CP_X_d8(reg8.A, memory)
    it('should XOR X with memory[PC] and only set flags',()=>{
      expect(memory.reg8(reg8.A)).to.equal(2)
    })
    it('should increase PC by 1',()=>{
      expect(memory.PC()).to.equal(0x0003)
    })
    expectZeroFlag(false, memory)
    expectSubtractFlag(true, memory)
    expectHalfCarryFlag(true, memory)
    expectCarryFlag(true, memory)
    expectNumberOfCycle(2, memory)
  })
})
