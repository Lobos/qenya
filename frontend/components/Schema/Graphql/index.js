import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button, ButtonGroup } from 'rctui'
import GraphiQL from 'graphiql'
import Refetch from 'refetch'
import { queryList, queryOne, queryDelete, querySave } from './convert'
import { getData } from '_/actions/data'

class Graphql extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      query: 'list',
      mock: {}
    }

    this.graphQLFetcher = this.graphQLFetcher.bind(this)
  }

  componentWillMount () {
    const { schema } = this.props
    Refetch.get(`/data/${schema.code}/getmock`).then(res => {
      this.setState({ mock: res.data })
    })
  }

  componentDidMount () {
    this.props.dispatch(getData({
      schema: this.props.schema.code,
      page: 1
    }, true))
  }

  graphQLFetcher (graphQLParams) {
    return new Promise((resolve, reject) => {
      Refetch.post('/graphql', graphQLParams, {dataType: 'json'})
      .then(res => {
        resolve(res)
      })
    })
  }

  handleQueryChange (query) {
    this.setState({ query })
  }

  render () {
    const { schema, list, status } = this.props
    const { query, mock } = this.state
    let queryStr = ''
    let variables = ''

    switch (query) {
      case 'list':
        queryStr = queryList(schema)
        variables = { page: 1, size: 10 }
        break
      case 'one':
        queryStr = queryOne(schema)
        variables = { _id: list[0]._id }
        break
      case 'delete':
        queryStr = queryDelete(schema)
        variables = { _id: list[0]._id }
        break
      case 'add':
        queryStr = querySave(schema)
        variables = mock
        break
      case 'edit':
        queryStr = querySave(schema, true)
        variables = list[0]
        break
    }
    variables = JSON.stringify(variables, null, 2)

    let tabs = status === 1 && list.length > 0
      ? ['list', 'one', 'add', 'edit', 'delete'] : ['list', 'add']

    return (
      <div>
        <ButtonGroup style={{marginBottom: 20}}>
          {tabs.map(s => (
          <Button key={s} disabled={s === query} status={s === query ? 'success' : undefined}
            onClick={this.handleQueryChange.bind(this, s)}>{s}</Button>
          ))}
        </ButtonGroup>
        <div style={{height: 600}}>
          <GraphiQL key={query} fetcher={this.graphQLFetcher} query={queryStr} variables={variables} />
        </div>
      </div>
    )
  }
}

Graphql.propTypes = {
  dispatch: PropTypes.func,
  list: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element
  ]),
  schema: PropTypes.object,
  status: PropTypes.number
}

const mapStateToProps = state => {
  const { data } = state
  return { list: data.list, status: data.status }
}

export default connect(mapStateToProps)(Graphql)
