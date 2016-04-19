import Application from './Application'
import {createApp, element} from 'deku'
import {createStore} from 'redux'
import GBCReducer from '../reducers/GBCReducer'

const store = createStore(reducer)
const render = createApp(document.getElementById('mount'), store.dispatch)

// Rendering function
function update (Component) {
    render(<Component />)
}

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
