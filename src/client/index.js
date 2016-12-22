
/* global React, ReactDOM, ReactRedux, Redux*/

import AppContainer from 'view/AppContainer'
import rootReducer from 'model'
import commandMiddleware from './client-io'

const Provider = ReactRedux.Provider

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;
const store = Redux.createStore(rootReducer, composeEnhancers(Redux.applyMiddleware(commandMiddleware)))

ReactDOM.render(
    <Provider store={store}>
      <AppContainer></AppContainer>
    </Provider>
    ,document.getElementById('mount'))
