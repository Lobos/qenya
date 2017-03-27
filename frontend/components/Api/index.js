import { PureComponent, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Button, Card, Table, Icon, Input, InputGroup, Modal, Tooltip } from 'rctui'
import { getList, removeApi } from '_/actions/apis'
import Text from '_/components/comm/Text'

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
    const mid = Modal.confirm(`Are you sure you want delete this api '${d.path}'?`, () => {
      this.props.dispatch(removeApi(d._id))
      Modal.close(mid)
    }, 'Confirm')
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
            New API
          </Button>
        </div>

        <Table data={this.getData()}
          columns={[
            { name: 'path', header: 'Path', sort: true },
            { name: 'method', header: 'Mothed' },
            { header: 'Description', content: d => <Text>{d.desc}</Text> },
            { width: '4rem', content: d => (
              <span>
                <Link to={`/api/${d._id}`}>
                  <Tooltip position="top" tip="Edit">
                    <Icon icon="edit" />
                  </Tooltip>
                </Link>
                {' '}
                <a href="javascript:;" onClick={this.handleRemove.bind(this, d)}>
                  <Tooltip position="top" tip="Remove">
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
