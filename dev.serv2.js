var path = require('path')
var express = require('express')
var webpack = require('webpack')
var http = require('http')
var https = require('https')

var app = express()
var config = require('./webpack.config.js')

config.devtool = 'source-map'
config.entry = {
  index: [
    'webpack-hot-middleware/client?path=http://localhost/__webpack_hmr',
    './src/index.js'
  ]
}
config.output.publicPath = 'http://localhost/'
config.module.loaders.push({
  test: /\.jsx?$/,
  loader: 'babel',
  query: {
    presets: ['react', 'es2015', 'react-hmre'],
    plugins: ['transform-object-rest-spread']
  }
})
config.plugins = [new webpack.HotModuleReplacementPlugin()]
var compiler = webpack(config)

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: '/'
}))

app.use(require('webpack-hot-middleware')(compiler))

app.get('/object/:version/libs/react.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'libs/react-with-addons.js'))
})

app.get('/object/libs/react-dom.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'libs/react-dom.js'))
})

app.get('/object/:version/*', function (req, res) {
  let path = req.path.replace(`/object/${req.params.version}`, '')
  res.redirect(path)
})

const hosts = {
  hostname: 'ip'
}

app.use((req, res) => {
  const hostname = req.hostname
  const options = {
    hostname: hosts[hostname],
    port: 80,
    path: req.originalUrl,
    method: req.method,
    headers: req.headers
  }

  const pReq = http.request(options, function (pRes) {
    res.writeHead(pRes.statusCode, pRes.headers)
    pRes.pipe(res)
  }).on('error', function () {
    res.end()
  })

  req.pipe(pReq)
})

const options = {
  key: 'file',
  cert: 'file'
}

const httpServ = http.createServer(app)
const httpsServ = https.createServer(options, app)

const startHttps = () => {
  httpsServ.listen(443, function () {
    /*
    let env = process.env
    let uid = parseInt(env['SUDO_UID'] || process.getuid(), 10)
    let gid = parseInt(env['SUDO_GID'] || process.getgid(), 10)
    process.setgid(gid)
    process.setuid(uid)
    */
    console.log('443 is start up')
  })
}

const start = () => {
  httpServ.listen(80, function () {
    console.log('80 is start up')
    startHttps()
  })
}

start()
