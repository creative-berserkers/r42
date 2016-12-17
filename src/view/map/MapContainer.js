import css from 'style.css'
import Group from './GroupComponent'

export default class MapContainer extends React.Component {
  constructor() {
    super()
  }

  render(){

    const groups = this.props.groups

    return <div className={`${this.props.className} ${css.someTestCSS}`}>
      {groups.map((group, index) => <Group key={index} name={group.name} units={group.units}></Group>)}
    </div>
  }
}
