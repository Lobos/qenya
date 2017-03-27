import { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Card, Form, FormControl } from 'rctui'
import { saveApi } from '_/actions/apis'

class Edit extends PureComponent {
  constructor (props) {
    super(props)

    this.handleBack = this.handleBack.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleBack () {
    window.history.back()
  }

  handleSubmit (data) {
    this.props.dispatch(saveApi(data, this.handleBack))
  }

  render () {
    const { id } = this.props.params
    let fetch
    if (id !== 'new') {
      fetch = {
        url: '/api/' + id,
        then: res => res.model
      }
    }

    return (
      <Card>
        <Card.Header>增加路由</Card.Header>
        <Form fetch={fetch}
          onSubmit={this.handleSubmit}
          onCancel={this.handleBack}
          buttons={{
          primary: '提交',
          cancel: '取消'
          }} style={{padding: 20}}>
          <FormControl label="路径" grid={3 / 5} tip="路径，可以使用通配符。例：/abc/:id/" required name="path" type="text" />
          <FormControl grid={1 / 4} label="操作" defaultValue="get" required name="method" type="select"
            data={['get', 'post', 'put', 'delete']} />
          <FormControl label="跨域支持" grid={3 / 5} name="cros" rows={3} type="textarea" tip="一行一个域名，如果不支持跨域，留空" />
          <FormControl label="描述" grid={3 / 5} name="desc" rows={3} type="textarea" />
        </Form>
      </Card>
    )
  }
}

Edit.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.object
}

Edit.defaultProps = {}

export default connect()(Edit)
