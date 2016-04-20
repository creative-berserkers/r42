import {STEP_FORWARD_CYCLE,STEP_BACKWARD_CYCLE, SHOW_MEMORY_DUMP} from '../actions/GBCActions'
import {step} from '../gbc/CPU'
import {default as Memory, reg8, flags} from '../gbc/MemoryInterceptor'
import {OperationCodesMapping as opcodes} from '../gbc/OperationCodesMapping'

const initialState = {
    history: [],
    currentMemory : Memory.createEmptyMemory(),
    showMemoryDump: false
}

export default function GBCReducer(state = initialState, action) {
    switch (action.type) {
      case STEP_FORWARD_CYCLE:
        const newMemory = state.currentMemory.clone()
        step(opcodes, newMemory)
        return Object.assign({}, state,{
            history : [...state.history, state.currentMemory],
            currentMemory: newMemory
        })
      case STEP_BACKWARD_CYCLE:
        if(state.history.length === 0)
          return state
        else return Object.assign({}, state, {
            history : [...state.history.slice(0, state.history.length-1)],
            currentMemory: state.history[state.history.length-1]
        })
      case SHOW_MEMORY_DUMP:
        return Object.assign({}, state, { showMemoryDump: action.flag})
      default:
        return state
    }
}
