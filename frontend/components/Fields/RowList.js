import { Component, PropTypes } from 'react'
import Row from './Row'

class RowList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dragIndex: -1
    }

    this.handleDragStart = this.handleDragStart.bind(this)
    this.moveRow = this.moveRow.bind(this)
  }

  handleDragStart (dragIndex) {
    this.setState({ dragIndex })
  }

  moveRow (dragIndex, targetIndex) {
    this.props.moveRow(dragIndex, targetIndex)
    this.setState({ dragIndex: targetIndex })
  }

  render () {
    const { onEdit, onRemove } = this.props
    return (
      <div style={{position: 'relative'}}>
        { this.props.fields.map((f, i) => (
        <Row key={f.name}
          field={f}
          index={i}
          dragIndex={this.state.dragIndex}
          moveRow={this.moveRow}
          onEdit={onEdit}
          onRemove={onRemove}
          onDragStart={this.handleDragStart}
        />
        )) }
      </div>
    )
  }
}

RowList.propTypes = {
  fields: PropTypes.array.isRequired,
  moveRow: PropTypes.func,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func
}

RowList.defaultProps = {}

export default RowList
