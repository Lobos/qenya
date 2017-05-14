import React from 'react'
import PropTypes from 'prop-types'
import { Popover } from 'rctui'

export default function Text(props) {
  const { children, max = 10, position } = props

  let sub = children
  if (sub && sub.length > max) {
    sub = `${sub.substr(0, max)}...`
  }

  return (
    <Popover trigger="hover" position={position}>
      <span>{sub}</span>
      <div style={{ padding: 10 }}>{children}</div>
    </Popover>
  )
}

Text.propTypes = {
  children: PropTypes.string,
  max: PropTypes.number,
  position: PropTypes.string,
}

Text.defaultProps = {
  position: 'top',
}
