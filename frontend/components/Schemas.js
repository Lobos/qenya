import { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Breadcrumb, Table } from 'rctui'
import { getList } from '../actions/schemas'

class Schema extends PureComponent {
  componentDidMount () {
    this.props.dispatch(getList())
  }

  render () {
    return (
      <div>
        <Breadcrumb style={{background: '#fff'}} data={[{text: 'Schemas'}]} />

        <Table bordered data={this.props.data}
          columns={[
            { name: 'code', header: 'Code' },
            { name: 'name', header: '名称' },
            { name: 'desc', header: '描述' }
          ]}
          pagination={{ size: 20 }}
        />
      </div>
    )
  }
}

Schema.propTypes = {
  data: PropTypes.array,
  dispatch: PropTypes.func,
  status: PropTypes.number
}

const mapStateToProps = state => {
  const { schemas } = state
  return { ...schemas }
}

export default connect(mapStateToProps)(Schema)
