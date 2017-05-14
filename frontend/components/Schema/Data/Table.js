import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Tooltip, Icon } from 'rctui'
import Text from '_/components/comm/Text'

class DataTable extends Component {
  handleEdit(d) {
    this.props.onEdit(d)
  }

  handleRemove(d) {
    this.props.onRemove(d)
  }

  renderColumns() {
    const { schema } = this.props
    const length = schema.fields.length
    const columns = schema.fields.map((f, i) => {
      let position = 'top'
      if (i === 0) position = 'top-left'
      else if (i === length - 1) position = 'top-right'

      return {
        header: f.label || f.name,
        content: (d) => {
          switch (f.type) {
            case 'bool':
              return d[f.name] ? 'true' : 'false'
            case 'text':
              return <Text position={position}>{d[f.name]}</Text>
            default:
              return d[f.name]
          }
        },
      }
    })

    columns.unshift({
      header: 'ID',
      name: '_id',
    })

    columns.push({
      width: '4rem',
      content: d => (
        <span>
          <a href="javascript:;" onClick={this.handleEdit.bind(this, d)}>
            <Tooltip position="top" tip="编辑">
              <Icon icon="edit" />
            </Tooltip>
          </a>
          {' '}
          <a href="javascript:;" onClick={this.handleRemove.bind(this, d)}>
            <Tooltip position="top" tip="删除">
              <Icon icon="trash" />
            </Tooltip>
          </a>
        </span>
      ),
    })

    return columns
  }

  render() {
    const { data } = this.props
    return (
      <Table data={data} columns={this.renderColumns()} />
    )
  }
}

DataTable.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]),
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  schema: PropTypes.object,
}

DataTable.defaultProps = {}

export default DataTable
