import css from 'style.css'
import ActionComponent from 'ActionComponent'

export default class ActionPoolComponent extends React.Component {
  constructor(){
    super()
  }

  render() {
    const {className, actions} = this.props
    return <div className={`${this.props.className} ${css.actionPoolComponent}`}>
      {actions.map(action =><ActionComponent name={action.name}></ActionComponent>)}
    </div>
  }
}
