import ActionPoolComponent from './ActionPoolComponent'

const mapStateToProps = (state) => ({
  actions : state.actions
})

const mapDispatchToProps = (dispatch)=>({})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ActionPoolComponent)
