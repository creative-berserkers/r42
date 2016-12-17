import css from 'style.css'

export default class ActionComponent extends React.Component {
  constructor() {
    super()
  }

  render(){

    const {name} = this.props

    return <div className={`${this.props.className} ${css.actionComponent}`}>
      {name}
    </div>
  }
}
