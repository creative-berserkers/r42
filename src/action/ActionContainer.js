import css from 'style.css'

export default class ActionContainer extends React.Component {
  constructor() {
    super()
  }

  render(){
    return <div className={`${this.props.className} ${css.diceContainer}`}>
      {this.props.children}
    </div>
  }
}
