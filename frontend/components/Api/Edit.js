import { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getList } from '_/actions/schemas'
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
      <Card>
        <Card.Header>增加路由</Card.Header>
        <Form buttons={{
          primary: '提交',
          cancel: '取消'
          }} style={{padding: 20}} data={this.state.data}>
          <FormControl label="路径" grid={3 / 5} tip="路径，可以使用通配符。例：/abc/:id/" required name="path" type="text" />
          <FormControl grid={1 / 4} label="操作" defaultValue="get" required name="method" type="select"
            data={{
              get: '查询',
              post: '保存／更新',
              delete: '删除'
            }} />
          <FormControl label="跨域支持" grid={3 / 5} name="cros" rows={3} type="json" tip="一行一个域名，如果不支持跨域，留空" />
          <FormControl label="描述" grid={3 / 5} name="desc" rows={3} type="textarea" />
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
