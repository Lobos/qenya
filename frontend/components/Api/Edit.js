import { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getList } from '../../actions/schemas'
import { Card, Form, FormControl } from 'rctui'

class Edit extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  componentWillMount () {
    this.props.dispatch(getList())
  }

  render () {
    return (
      <Card style={{padding: 20}}>
        <Form data={this.state.data}>
          <FormControl label="路径" grid={7 / 8} tip="路径，可以使用通配符。例：/abc/:id/" required name="path" type="text" />
          <FormControl grid={1 / 4} label="请求方法" defaultValue="get" required name="method" type="select" data={['get', 'post', 'put', 'delete']} />
          <FormControl grid={1 / 4} label="操作" defaultValue="get" required name="op" type="select"
            data={{
              get: '查询',
              post: '保存／更新',
              delete: '删除'
            }} />
          <FormControl label="Query" grid={7 / 8} name="query" rows={3} type="json" />
          <FormControl label="描述" grid={7 / 8} name="desc" rows={3} type="textarea" />
          <FormControl label="Map" gird={7 / 8}>
            map
          </FormControl>
        </Form>
      </Card>
    )
  }
}

Edit.propTypes = {
  dispatch: PropTypes.func,
  schemas: PropTypes.array
}

Edit.defaultProps = {}

const mapStateToProps = state => {
  const { schemas } = state
  return { ...schemas }
}

export default connect(mapStateToProps)(Edit)
