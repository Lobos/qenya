import React, { PureComponent, PropTypes } from 'react'
import { Button, ButtonGroup } from 'rctui'
import GraphiQL from 'graphiql'
import Refetch from 'refetch'
import { queryList, queryOne, queryDelete, querySave } from './convert'

class Graphql extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      query: 'list',
      mock: ''
    }

    this.graphQLFetcher = this.graphQLFetcher.bind(this)
  }

  componentWillMount () {
    const { schema } = this.props
    Refetch.get(`/data/${schema.code}/getmock`).then(res => {
      this.setState({ mock: JSON.stringify({ data: res.data }, null, 2) })
    })
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
    const { schema } = this.props
    const { query, mock } = this.state
    let queryStr = ''
    let variables = ''

    switch (query) {
      case 'list':
        queryStr = queryList(schema)
        break
      case 'one':
        queryStr = queryOne(schema)
        break
      case 'delete':
        queryStr = queryDelete(schema)
        break
      case 'save':
        queryStr = querySave(schema)
        variables = mock
        break
    }

    return (
      <div>
        <ButtonGroup style={{marginBottom: 20}}>
          {['list', 'one', 'save', 'delete'].map(s => (
          <Button key={s} disabled={s === query} status={s === query ? 'success' : undefined}
            onClick={this.handleQueryChange.bind(this, s)}
          >{s}</Button>
          ))}
        </ButtonGroup>
        <div style={{height: 600}}>
          <GraphiQL fetcher={this.graphQLFetcher} query={queryStr} variables={variables} />
        </div>
      </div>
    )
  }
}

Graphql.propTypes = {
  schema: PropTypes.object
}

Graphql.defaultProps = {
}

export default Graphql
