import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Breadcrumb, Card, Form, FormControl, Grid } from 'rctui'
import { saveApi } from '_/actions/apis'

class Edit extends PureComponent {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(data) {
    this.props.dispatch(saveApi(data, this.props.history.goBack))
  }

  render() {
    const { id } = this.props.match.params
    let fetch
    if (id !== 'new') {
      fetch = {
        url: `/api/${id}`,
        then: res => res.data,
      }
    }

    return (
      <div>
        <Breadcrumb
          style={{ background: '#fff' }} data={[
          { text: 'API', href: '#/api' },
          { text: id === 'new' ? '新建' : '编辑' },
          ]}
        />

        <Card>
          <Form
            fetch={fetch}
            onSubmit={this.handleSubmit}
            onCancel={this.props.history.goBack}
            buttons={{
              primary: 'Submit',
              cancel: 'Cancel',
            }}
            style={{ padding: '3rem 2rem', width: 800 }}
          >
            <FormControl
              label="Route" grid={1} required name="route" type="text"
              tip="url路径，不包含域名，可以使用通配规则传参数，参考koa-router，例：/abc/:id/"
            />

            <Grid width={1 / 2}>
              <FormControl
                grid={1} label="Method" defaultValue="get" required name="method" type="select"
                data={['get', 'post', 'put', 'delete']}
              />
            </Grid>

            <Grid width={1 / 2}>
              <FormControl
                label="权重" required grid={1} name="weight" type="integer" defaultValue="0"
                tip="整数，当两条路由冲突时，会匹配权重高的路由"
              />
            </Grid>

            <FormControl
              label="Graphql Query" grid={1} type="textarea" name="query" required
              tip="graphql 查询语句，get请求时从queryString或者路由规则中获取参数，post、put、delete请求时从form中获取"
            />
            <FormControl label="描述" grid={1} name="desc" rows={3} type="textarea" />
          </Form>
        </Card>
      </div>
    )
  }
}

Edit.propTypes = {
  dispatch: PropTypes.func,
  history: PropTypes.object,
  match: PropTypes.object,
}

Edit.defaultProps = {}

export default connect()(Edit)
