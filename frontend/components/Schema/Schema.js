import { PureComponent, PropTypes } from 'react'
import { Breadcrumb, Nav } from 'rctui'
import Fields from './Fields'
import Data from './Data'
import Graphql from './Graphql'

import _styles from '../../styles/app.scss'

class Schema extends PureComponent {
  constructor (props) {
    super(props)

    this.handleTabChange = this.handleTabChange.bind(this)
  }

  handleTabChange (tab) {
    const { schema } = this.props
    const { router } = this.context
    router.push(`/schema/${schema.code}/${tab}`)
  }

  render () {
    const { router } = this.context
    const { tab, schema } = this.props

    return (
      <div>
        <Breadcrumb style={{background: '#fff'}} data={[
          { text: 'Collections', href: router.createHref('/') },
          { text: schema.name, active: true }
        ]} />

        <Nav active={tab || 'fields'} onSelect={this.handleTabChange} type="tab">
          <Nav.Item id="fields">字段</Nav.Item>
          <Nav.Item id="data">数据</Nav.Item>
          <Nav.Item id="graphql">Graphql</Nav.Item>
        </Nav>

        <div className={_styles['tab-content']}>
          { tab === 'fields' && <Fields schema={schema} /> }
          { tab === 'data' && <Data schema={schema} /> }
          { tab === 'graphql' && <Graphql schema={schema} /> }
        </div>
      </div>
    )
  }
}

Schema.propTypes = {
  params: PropTypes.object,
  schema: PropTypes.object,
  tab: PropTypes.string
}

Schema.defaultProps = {
  tab: 'fields'
}

Schema.contextTypes = {
  router: PropTypes.object
}

export default Schema
