import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { Grid, Tooltip, Icon } from 'rctui'

import _styles from '_/styles/app.scss'

class Row extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.handleEdit = this.handleEdit.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleDragEnd = this.handleDragEnd.bind(this)
    this.handleDragOver = this.handleDragOver.bind(this)
  }

  handleRemove() {
    this.props.onRemove(this.props.index)
  }

  handleEdit() {
    this.props.onEdit(this.props.index, this.props.field)
  }

  handleDragStart(e) {
    const el = e.target
    this.props.onDragStart(this.props.index)
    setTimeout(() => {
      el.classList.add(_styles.hide)
    })
  }

  handleDragEnd(e) {
    e.target.classList.remove(_styles.hide)
  }

  handleDragOver(e) {
    const { dragIndex, index } = this.props

    if (dragIndex === index) return

    const hover = findDOMNode(this)
    const hoverBoundingRect = hover.getBoundingClientRect()

    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    const hoverClientY = e.clientY - hoverBoundingRect.top

    if (dragIndex < index && hoverClientY < hoverMiddleY) {
      return
    }

    if (dragIndex > index && hoverClientY > hoverMiddleY) {
      return
    }

    this.props.moveRow(dragIndex, index)
  }

  render() {
    const { field, index } = this.props
    return (
      <Grid
        draggable
        key={field.name}
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
        onDragOver={this.handleDragOver}
        data-index={index}
        className={`${_styles['row-list']} ${_styles.draggable}`}
      >
        <Grid width={4 / 24}>
          <a href="javascript:;" onClick={this.handleEdit}>
            {field.name}
          </a>
        </Grid>
        <Grid width={4 / 24}>{field.label}</Grid>
        <Grid width={4 / 24}>{field.type}</Grid>
        <Grid style={{ textAlign: 'center' }} width={2 / 24}>{field.required ? <Icon icon="check" /> : ''}</Grid>
        <Grid style={{ textAlign: 'center' }} width={2 / 24}>{field.unique ? <Icon icon="check" /> : ''}</Grid>
        <Grid>{field.defaultValue}</Grid>
        <Grid width={2 / 24}>
          <span>
            <a href="javascript:;" onClick={this.handleEdit}>
              <Tooltip position="top" tip="编辑">
                <Icon icon="edit" />
              </Tooltip>
            </a>
            {' '}
            <a href="javascript:;" onClick={this.handleRemove}>
              <Tooltip position="top" tip="删除">
                <Icon icon="trash" />
              </Tooltip>
            </a>
          </span>
        </Grid>
      </Grid>
    )
  }
}

Row.propTypes = {
  dragIndex: PropTypes.number,
  field: PropTypes.object,
  index: PropTypes.number,
  moveRow: PropTypes.func,
  onDragStart: PropTypes.func,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
}

Row.defaultProps = {}

export default Row
