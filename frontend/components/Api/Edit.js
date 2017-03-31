import { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Card, Form, FormControl } from 'rctui'
import { saveApi } from '_/actions/apis'

class Edit extends PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (data) {
    this.props.dispatch(saveApi(data, this.props.history.goBack))
  }

  render () {
    const { id } = this.props.match.params
    let fetch
    if (id !== 'new') {
      fetch = {
        url: '/api/' + id,
        then: res => res.data
      }
    }

    return (
      <Card>
        <Card.Header>API</Card.Header>
        <Form fetch={fetch}
          onSubmit={this.handleSubmit}
          onCancel={this.props.history.goBack}
          buttons={{
            primary: 'Submit',
            cancel: 'Cancel'
          }} style={{ padding: 20 }}>
          <FormControl label="Path" grid={3 / 5} tip="url path without domain, like：/abc/:id/" required name="path" type="text" />
          <FormControl label="Weight" required grid={1 / 5} name="weight" type="integer" defaultValue="0" />
          <FormControl grid={1 / 4} label="Method" defaultValue="get" required name="method" type="select"
            data={['get', 'post', 'put', 'delete']} />
          <FormControl label="Graphql Query" grid={3 / 5} type="textarea" name="query" required />
          <FormControl label="Description" grid={3 / 5} name="desc" rows={3} type="textarea" />
        </Form>
      </Card>
    )
  }
}

Edit.propTypes = {
  dispatch: PropTypes.func,
  history: PropTypes.object,
  match: PropTypes.object
}

Edit.defaultProps = {}

export default connect()(Edit)
