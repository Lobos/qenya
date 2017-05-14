const app = require('./build')

app({
  appPort: 5000,
  apiPort: 5001,
  render(res) {
    if (res.data) {
      const keys = Object.keys(res.data)
      return {
        success: true,
        model: keys.length === 1 ? res.data[keys[0]] : res.data,
      }
    }
    return {
      success: false,
      errors: res.errors,
    }
  },
})

