import css from 'style.css'

const faces = ['⚀','⚁','⚂','⚃','⚄','⚅']
const colors = ['white','yellow','green','red','blue','violet']

const diceSource = {
  beginDrag: function (props) {
    return {};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

@ReactDnD.DragSource('dice', diceSource, collect)
export default class DiceComponent extends React.Component {

  static propTypes = {
    face: React.PropTypes.number.isRequired,
    lock: React.PropTypes.bool.isRequired
  };

  render(){
    const {
      className,
      face,
      lock,
      onClick,
      connectDragSource,
      isDragging } = this.props

    return connectDragSource(
      <div className={`${className} ${css.dice} ${lock ? css.diceLocked : ''}`}
        style={{backgroundColor:colors[face-1]}}
        onClick={onClick}>
        <span>{faces[face-1]}</span>
      </div>
    )
  }
}
