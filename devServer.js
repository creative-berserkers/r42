import webpack from 'webpack'
import config from './webpack.config.dev'
import dev from 'webpack-dev-middleware'
import hot from 'webpack-hot-middleware'
import express from 'express'
import path from 'path'

import {string, element} from 'deku'

var compiler = webpack(config)

var app = express()

/*var Application = {
  render() {
    return (
      element('div', {}, [
        element('p',{},[
          'Hello World!'
        ]),
        element('button',{},[
          'Click Me'
        ])
      ])
    )
  }
}*/

import Application from './src/components/Application'

console.log(Application)

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="mount">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
}

app.use(dev(compiler, {noInfo: true, publicPath: config.output.publicPath}))
app.use(hot(compiler))

app.get('*', function(req, res) {
  res.send(renderFullPage(string.renderString(<Application> </Application>), {}))
})

console.log('Compiling...')
app.listen(3000, 'localhost', function(err) {
  if (err) console.log(err)
  else console.log('Listening at http://localhost:3000');
})
