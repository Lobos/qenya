import { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { Breadcrumb, Nav } from 'rctui'
import { getList } from '_/actions/schemas'
import Fields from './Fields'
import Data from './Data'
import Graphql from './Graphql'

import _styles from '../../styles/app.scss'

class Container extends PureComponent {
  constructor (props) {
    super(props)

    this.handleTabChange = this.handleTabChange.bind(this)
  }

  componentDidMount () {
    this.props.dispatch(getList())
  }

  handleTabChange (tab) {
    const { history, match } = this.props
    history.push(`${match.url}/${tab}`)
  }

  render () {
    const { data, match, status, location } = this.props

    const { url } = match
    const tab = location.pathname.replace(url + '/', '')

    if (status !== 1) {
      return <span>{data}</span>
    }

    const schema = data.find(d => d.code === match.params.code)
    if (!schema) {
      return <div>not found.</div>
    }

    return (
      <div>
        <Breadcrumb style={{background: '#fff'}} data={[
          { text: 'Collections', href: '#/collections' },
          { text: schema.name, active: true }
        ]} />

        <Nav active={tab} onSelect={this.handleTabChange} type="tab">
          <Nav.Item id="fields">Fields</Nav.Item>
          <Nav.Item id="data">Data</Nav.Item>
          <Nav.Item id="graphql">Graphql</Nav.Item>
        </Nav>

        <div className={_styles['tab-content']}>
          <Route exact path={url} render={() => <Redirect to={`${url}/fields`} />} />
          <Route path={`${url}/fields`} render={() => <Fields schema={schema} />} />
          <Route path={`${url}/data`} render={() => <Data schema={schema} />} />
          <Route path={`${url}/graphql`} render={() => <Graphql schema={schema} />} />
        </div>
      </div>
    )
  }
}

Container.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.string
  ]),
  dispatch: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  status: PropTypes.number
}

Container.defaultProps = {}

const mapStateToProps = state => {
  const { schemas } = state
  return { ...schemas }
}

export default connect(mapStateToProps)(Container)
