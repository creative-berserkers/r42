export const STEP_FORWARD_CYCLE = 'STEP_FORWARD_CYCLE'
export function stepForwardCycle(){
  return {
    type: STEP_FORWARD_CYCLE
  }
}

export const STEP_BACKWARD_CYCLE = 'STEP_BACKWARD_CYCLE'
export function stepBackwardCycle(){
  return {
    type: STEP_BACKWARD_CYCLE
  }
}

export const SHOW_MEMORY_DUMP = 'SHOW_MEMORY_DUMP'
export function showMemoryDump(flag){
  return {
    type : SHOW_MEMORY_DUMP,
    flag: flag
  }
}
