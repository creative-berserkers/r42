export const STEP_FORWARD_CYCLE = 'STEP_FORWARD_CYCLE'
export function stepForwardCycle(){
  return {
    type: STEP_FORWARD_CYCLE,
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

export const PLAY = 'PLAY'
export function play(speed){
  return {
    type : PLAY,
    speed : speed
  }
}

export const STOP = 'STOP'
export function stop(speed){
  return {
    type : STOP,
    speed: speed
  }
}

export const CHANGE_SPEED = 'CHANGE_SPEED'
export function changeSpeed(speed){
  return {
    type: CHANGE_SPEED,
    speed: speed
  }
}

export const CHANGE_THRESHOLD = 'CHANGE_THRESHOLD'
export function changeThreshold(threshold){
  return {
    type: CHANGE_THRESHOLD,
    threshold: threshold
  }
}

export const LOAD_ROM = 'LOAD_ROM'
export function loadROM(data){
  return {
    type : LOAD_ROM,
    data : data
  }
}

export const SET_PC = 'SET_PC'
export function setPC(pc){
  return {
    type : SET_PC,
    pc : pc
  }
}

export const KEY_DOWN = 'KEY_DOWN'
export function keyDown(key){
  return {
    type : KEY_DOWN,
    key : key
  }
}

export const KEY_UP = 'KEY_UP'
export function keyUp(key){
  return {
    type : KEY_UP,
    key : key
  }
}
