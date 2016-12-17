import css from 'style.css'

import DiceComponent from './DiceComponent'

@ReactDnD.DragDropContext(ReactDnDHTML5Backend)
export default class DicePoolComponent extends React.Component {

  render(){
    const {className, dices, locks, onReroll, onLock} = this.props

    return <div className={`${className} ${css.dicePoolComponent}`}>
      <button onClick={(event)=>{onReroll(dices,locks)}}>Reroll dices</button>
      {dices.map((number, index)=><DiceComponent key={index} face={number} lock={!!locks[index]} onClick={onLock.bind(null,index)}></DiceComponent>)}
    </div>
  }
}
