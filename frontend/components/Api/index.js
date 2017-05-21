import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Breadcrumb, Button, Card, Table, Icon, Input, InputGroup, Modal, Tooltip } from 'rctui'
import { getList, removeApi, saveApi } from '_/actions/apis'
import Text from '_/components/comm/Text'

class Api extends PureComponent {
  constructor(props) {
    super(props)

    this.state = { filtre: '' }

    this.setFilter = this.setFilter.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(getList())
  }

  setFilter(filter) {
    this.setState({ filter })
  }

  getData() {
    const { data } = this.props
    const { filter } = this.state

    if (!Array.isArray(data)) return data

    data.sort((a, b) => a.weight < b.weight ? 1 : -1)

    return filter ? data.filter(d => d.route.indexOf(filter) >= 0) : data
  }

  handleRemove(d) {
    const mid = Modal.confirm(`确定删除 '${d.route}' 吗?`, () => {
      this.props.dispatch(removeApi(d._id))
      Modal.close(mid)
    }, 'Confirm')
  }

  toggleStatus(d) {
    this.props.dispatch(saveApi({ _id: d._id, status: d.status === 1 ? 0 : 1 }))
  }

  render() {
    const { history } = this.props

    return (
      <div>
        <Breadcrumb style={{ background: '#fff' }} data={[{ text: 'API' }]} />

        <Card style={{ padding: '2rem' }}>
          <div>
            <div style={{ width: 300, marginBottom: 20, display: 'inline-block' }}>
              <InputGroup>
                <Input type="text" onChange={this.setFilter} />
                <Icon icon="search" />
              </InputGroup>
            </div>

            <Button
              style={{ float: 'right' }}
              status="success"
              onClick={() => history.push('/api/new')}
            >
              <Icon icon="plus" />
              New API
            </Button>
          </div>

          <Table
            data={this.getData()}
            columns={[
              { name: 'route', header: 'Route', sort: true },
              { name: 'method', header: 'Method' },
              { name: 'weight', header: '权重', sort: true },
              { header: '状态', content: d => (d.status === 1 ? <Icon icon="check" /> : '') },
              { header: '描述', content: d => <Text>{d.desc}</Text> },
              { width: '6rem',
                content: d => (
                  <span>
                    <a href="javascript:;" onClick={() => this.toggleStatus(d)}>
                      <Tooltip position="top" tip={d.status ? '暂停' : '启用'}>
                        {d.status ? <Icon icon="pause" /> : <Icon icon="play" />}
                      </Tooltip>
                    </a>
                    {' '}
                    <Link to={`/api/${d._id}`}>
                      <Tooltip position="top" tip="Edit">
                        <Icon icon="edit" />
                      </Tooltip>
                    </Link>
                    {' '}
                    <a href="javascript:;" onClick={() => this.handleRemove(d)}>
                      <Tooltip position="top" tip="Remove">
                        <Icon icon="trash" />
                      </Tooltip>
                    </a>
                  </span>
              ) },
            ]}
            pagination={{ size: 20 }}
          />
        </Card>
      </div>
    )
  }
}

Api.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]),
  dispatch: PropTypes.func,
  history: PropTypes.object,
}

Api.defaultProps = {}

const mapStateToProps = (state) => {
  const { apis } = state
  return { ...apis }
}

export default connect(mapStateToProps)(Api)
