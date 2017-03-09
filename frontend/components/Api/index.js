import { Component, PropTypes } from 'react'
import { Button, Card, Table, Icon, Input, InputGroup, Message } from 'rctui'
import { loading } from '../../utils/loading'
import Refetch from 'refetch'

const Loading = loading({ position: 'initial', height: 200 })

class Api extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: Loading,
      filter: ''
    }

    this.setFilter = this.setFilter.bind(this)
  }

  componentWillMount () {
    this._isUnmount = false
    Refetch.get('/api').then(res => {
      if (this._isUnmount) return
      if (res.success) {
        this.setState({ data: res.model })
      } else {
        Message.error(res.msg)
      }
    })
  }

  componentWillUnmount () {
    this._isUnmount = false
  }

  handleEdit (id) {
    this.context.router.push('/api/' + id)
  }

  getData () {
    let { data, filter } = this.state
    if (!filter || data === Loading) return data

    return data.filter(d => d.path.indexOf(filter) >= 0)
  }

  setFilter (filter) {
    this.setFilter({ filter })
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
            { name: 'path', header: '路径' },
            { name: 'method', header: '请求方法' },
            { name: 'op', header: '操作' },
            { content: d => 'ss' }
          ]}
        />
      </Card>
    )
  }
}

Api.propTypes = {
}

Api.defaultProps = {}

Api.contextTypes = {
  router: PropTypes.object
}

export default Api
