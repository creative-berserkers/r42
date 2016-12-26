export default function changed(oldState, newState){
  const resultOldToNew = Object.keys(oldState).reduce((result, oldKey) => {
    return result === true ? result : oldState[oldKey] !== newState[oldKey]
  }, false)

  const resultNewToOld = Object.keys(newState).reduce((result, newKey) => {
    return result === true ? result : oldState[newKey] !== newState[newKey]
  }, false)

  return resultNewToOld || resultOldToNew ? newState : oldState
}