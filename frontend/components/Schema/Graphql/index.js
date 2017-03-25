import React, { PureComponent, PropTypes } from 'react'
import { Button, ButtonGroup } from 'rctui'
import GraphiQL from 'graphiql'
import Refetch from 'refetch'
import { queryList, queryOne } from './convert'

class Graphql extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      query: 'list'
    }

    this.graphQLFetcher = this.graphQLFetcher.bind(this)
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
    const { query } = this.state
    let queryStr = ''
    switch (query) {
      case 'list':
        queryStr = queryList(schema)
        break
      case 'one':
        queryStr = queryOne(schema)
        break
    }

    return (
      <div>
        <ButtonGroup style={{marginBottom: 20}}>
          {['list', 'one', 'mutation'].map(s => (
          <Button status={query === s ? 'primary' : undefined}
            onClick={this.handleQueryChange.bind(this, s)}
          >{s}</Button>
          ))}
        </ButtonGroup>
        <div style={{height: 600}}>
          <GraphiQL fetcher={this.graphQLFetcher} query={queryStr} />
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
