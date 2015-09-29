import { Component, PropTypes } from 'react'

const loadingImage = require('../themes/pure/images/loading.gif')

export default class Loading extends Component {
  static displayName = 'Loading'

  static propTypes = {
    className: PropTypes.string
  }

  render () {
    return (
      <div className={this.props.className}><img src={loadingImage} /></div>
    )
  }
}
