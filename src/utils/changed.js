import shallowEqual from './shallow-equal'

export default function changed(oldState, newState){

  return shallowEqual(oldState, newState) ? oldState : newState
}