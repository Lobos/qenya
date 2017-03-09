import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button, Dropdown, Icon, Modal, Pagination } from 'rctui'
import { getData, saveData, removeData, createMockData, removeAll } from '../../actions/data'
import Table from './Table'
import Edit from './Edit'

import _styles from '../../styles/app.scss'

class Data extends Component {
  constructor (props) {
    super(props)
    this.state = {
      page: 1
    }

    this.handleEdit = this.handleEdit.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleClear = this.handleClear.bind(this)
  }

  componentDidMount () {
    this.props.dispatch(getData({
      schema: this.props.schema.code,
      page: 1
    }))
  }

  handlePageChange (page) {
    const { query } = this.props
    this.props.dispatch(getData(Object.assign({}, query, {page})))
  }

  handleMockCreate (number) {
    const { dispatch, schema } = this.props
    dispatch(createMockData(schema.code, number))
  }

  handleClear () {
    const { dispatch, schema } = this.props
    dispatch(removeAll(schema.code))
  }

  handleEdit (data) {
    const { dispatch, schema } = this.props
    const mid = Modal.open({
      buttons: {
        '提交': 'submit',
        '取消': true
      },
      padding: '2rem',
      width: '50rem',
      header: `${data ? '编辑' : '添加'}数据`,
      content: (
        <Edit data={data}
          fields={this.props.schema.fields}
          onSubmit={d => {
            dispatch(saveData(schema.code, d, () => {
              Modal.close(mid)
            }))
          }}
        />
      )
    })
  }

  handleRemove (data) {
    // Modal.confirm('确定删除这条数据？', () => {
      const { dispatch, schema } = this.props
      dispatch(removeData(schema.code, data._id))
    // }, '删除')
  }

  render () {
    const { list, query, schema, total } = this.props

    return (
      <div>
        <div className={_styles['tab-buttons']}>
          <Button status="success" onClick={this.handleEdit.bind(this, undefined)}>
            <Icon icon="plus" />
            增加数据
          </Button>

          <Dropdown text="生成模拟数据">
            {[10, 50, 100].map(i => (
              <a key={i} href="javascript:;" onClick={this.handleMockCreate.bind(this, i)}>
                {i}条数据
              </a>
            ))}
          </Dropdown>

          <Button onClick={this.handleClear}>
            清空数据
          </Button>
        </div>

        <div>
          <Table data={list}
            schema={schema}
            onEdit={this.handleEdit}
            onRemove={this.handleRemove}
          />
          <div style={{textAlign: 'center'}}>
            <Pagination total={total} page={query.page} onChange={this.handlePageChange} />
          </div>
        </div>
      </div>
    )
  }
}

Data.propTypes = {
  dispatch: PropTypes.func,
  list: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element
  ]),
  query: PropTypes.object,
  schema: PropTypes.object,
  total: PropTypes.number
}

Data.defaultProps = {}

const mapStateToProps = state => {
  const { data } = state
  return { ...data }
}

export default connect(mapStateToProps)(Data)
