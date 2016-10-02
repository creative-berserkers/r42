import css from 'style.css'

export default class DiceContainer extends React.Component {
  constructor() {
    super()

  }

  const r = randomInt.bind(null, 1,6);

  const dispatchRandomRoll = () => this.props.onReroll(diceActions.reroll([r(),r(),r(),r(),r(),r()]))

  dispatchRandomRoll()

  render(){
    const dice = this.props.dice

    return <div className={`${this.props.className} ${css.diceContainer}`}>
      <button onClick={(event)=>{dispatchRandomRoll()}}>Reroll dices</button>
      {dice.numbers.map((number)=><Dice face={number}></Dice>)}
    </div>
  }
}
