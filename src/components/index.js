import {dom, element} from 'deku';
import Application from './Application';

const render = dom.createRenderer(document.getElementById('mount'));

// Rendering function
function update (Component) {
    render(<Component />)
}

// First render
update(Application);

// Hooking into HMR
// This is the important part as it will reload your code and re-render the app accordingly
if (module.hot) {
    module.hot.accept('./Application.js', function() {
        const nextApplication = require('./Application.js').default;
        update(nextApplication);
    });
}