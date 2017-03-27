import { PureComponent, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { fetch } from '_/utils/fetch'
import { getList, removeApi } from '_/actions/apis'
import { Button, Card, Table, Icon, Input, InputGroup, Modal, Tooltip } from 'rctui'

class Api extends PureComponent {
  constructor (props) {
    super(props)

    this.state = { filtre: '' }

    this.setFilter = this.setFilter.bind(this)
  }

  componentDidMount () {
    this.props.dispatch(getList())
  }

  handleEdit (id) {
    this.context.router.push('/api/' + id)
  }

  handleRemove (d) {
    const mid = Modal.confirm(`确定删除 ${d.path} 吗`, () => {
      this.props.dispatch(removeApi(d._id))
      Modal.close(mid)
    }, '删除')
  }

  getData () {
    const { data } = this.props
    let { filter } = this.state
    if (!filter || !Array.isArray(data)) return data

    return data.filter(d => d.path.indexOf(filter) >= 0)
  }

  setFilter (filter) {
    this.setState({ filter })
  }

  render () {
    return (
      <Card style={{padding: 20}}>
        <div>
          <div style={{width: 300, marginBottom: 20, display: 'inline-block'}}>
            <InputGroup>
              <Input type="text" onChange={this.setFilter} />
              <Icon icon="search" />
            </InputGroup>
          </div>

          <Button style={{float: 'right'}} onClick={this.handleEdit.bind(this, 'new')} status="success">
            <Icon icon="plus" />
            增加路由
          </Button>
        </div>

        <Table data={this.getData()}
          columns={[
            { name: 'path', header: '路径', sort: true },
            { name: 'method', header: '请求方法' },
            { name: 'desc', header: '说明' },
            { width: '4rem', content: d => (
              <span>
                <Link to={`/api/${d._id}`}>
                  <Tooltip position="top" tip="编辑">
                    <Icon icon="edit" />
                  </Tooltip>
                </Link>
                {' '}
                <a href="javascript:;" onClick={this.handleRemove.bind(this, d)}>
                  <Tooltip position="top" tip="删除">
                    <Icon icon="trash" />
                  </Tooltip>
                </a>
              </span>
            ) }
          ]}
          pagination={{size: 20}}
        />
      </Card>
    )
  }
}

Api.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element
  ]),
  dispatch: PropTypes.func
}

Api.defaultProps = {}

Api.contextTypes = {
  router: PropTypes.object
}

const mapStateToProps = state => {
  const { apis } = state
  return { ...apis }
}

export default connect(mapStateToProps)(Api)
