const app = require('./build').default

// api server =================================
app({
  appPort: 5000,
  apiPort: 5001,
  render: function (res) {
    if (res.data) {
      let keys = Object.keys(res.data)
      return {
        success: true,
        model: keys.length === 1 ? res.data[keys[0]] : res.data
      }
    } else {
      return {
        success: false,
        errors: res.errors
      }
    }
  }
})

