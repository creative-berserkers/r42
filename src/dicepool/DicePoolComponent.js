import css from 'style.css'

import DiceComponent from './DiceComponent'

export default ({className, dices, onReroll})=><div className={`${className} ${css.diceContainer}`}>
  <button onClick={(event)=>{onReroll()}}>Reroll dices</button>
  {dices.map((number)=><DiceComponent face={number}></DiceComponent>)}
</div>
