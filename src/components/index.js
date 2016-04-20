import Application from './Application'
import {createApp, element} from 'deku'
import {createStore, applyMiddleware} from 'redux'
import GBCReducer from '../reducers/GBCReducer'

let canvas = document.getElementById('display')

const canvasRenderer = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  // render to canvas
  var ctx = canvas.getContext("2d");

  ctx.fillStyle = "green";
  ctx.fillRect(10, 10, 100, 100);

  return result
}

const store = createStore(GBCReducer, applyMiddleware(canvasRenderer))
const render = createApp(document.getElementById('mount'), store.dispatch)

// Rendering function
function update (Component) {
    render(<Component />, store.getState())
}
store.subscribe(()=>{
  update(Application)
})
// First render
update(Application)

// Hooking into HMR
// This is the important part as it will reload your code and re-render the app accordingly
if (module.hot) {
    module.hot.accept('./Application.js', function() {
        const nextApplication = require('./Application.js').default
        update(nextApplication)
    })
}
