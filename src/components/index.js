'use strict'
const Application = require('./Application')
const {createApp, element} = require('deku')
const {createStore, applyMiddleware} = require('redux')
const GameReducer = require('../reducers/GameReducer')

const store = createStore(GameReducer)
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
