import { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Mask } from 'rctui'
import { getList } from '../../actions/schemas'
import Schema from './Schema'

class Container extends Component {
  componentDidMount () {
    this.props.dispatch(getList())
  }

  render () {
    const { data, params, status } = this.props

    if (status !== 1) {
      return <Mask active><span>{data || '加载中...'}</span></Mask>
    }

    const schema = data.find(d => d.code === params.code)
    if (!schema) {
      return <div>not found.</div>
    }

    return (
      <Schema schema={schema} tab={params.tab} />
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
  params: PropTypes.object,
  status: PropTypes.number
}

Container.defaultProps = {}

const mapStateToProps = state => {
  const { schemas } = state
  return { ...schemas }
}

export default connect(mapStateToProps)(Container)
