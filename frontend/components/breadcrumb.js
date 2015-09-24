'use strict'

import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class Breadcrumb extends Component {
  static displayName = 'Breadcrumb'

  static propTypes = {
    items: PropTypes.array,
    styles: PropTypes.object
  }

  render () {
    const { items, styles } = this.props
    const list = items.map((item, i) => {
      if (Array.isArray(item)) {
        item = <a href={`#${item[1]}`}>{item[0]}</a>
      }
      return (
        <li key={i}>{item}</li>
      )
    })
    return (
      <ul className={styles.breadcrumb}>{list}</ul>
    )
  }
}

function mapStateToProps(state) {
  return {
    styles: state.styles.main
  }
}

export default connect(
  mapStateToProps
)(Breadcrumb)
