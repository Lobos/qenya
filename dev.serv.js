import app from './server'

// api server =================================
app({
  appPort: 5000,
  apiPort: 5001,
  staticPort: 5002,
  config: {
    engine: 'mongodb',
  },
  render: (res) => {
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
