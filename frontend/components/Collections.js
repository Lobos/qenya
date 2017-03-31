import { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Breadcrumb, Table, Button, Modal, Form, FormControl, Icon, Tooltip, Card } from 'rctui'
import * as Datetime from 'rctui/utils/datetime'
import { getList, saveCollection, removeCollection } from '_/actions/schemas'
import Refetch from 'refetch'

import _styles from '_/styles/app.scss'

class Collection extends PureComponent {
  constructor (props) {
    super(props)

    this.handleSave = this.handleSave.bind(this)
  }

  componentDidMount () {
    this.props.dispatch(getList())
  }

  checkCode (value, formData, callback) {
    let reg = /^[a-z0-9_]+$/i
    if (!reg.test(value)) {
      callback(new Error('Code must only contain alpha characters, underscores, and dashes'))
    } else if (value.length > 20) {
      callback(new Error('Code can not exceed 20 characters'))
    } else {
      Refetch.post('/schema/exist', { _id: formData._id, code: value })
        .then(res => {
          if (res.data) callback(true)
          else callback(new Error('Code already exists.'))
        })
    }
  }

  handleEdit (data) {
    this.mid = Modal.open({
      buttons: {
        'Submit': 'submit',
        'Cancel': true
      },
      padding: '2rem',
      width: '40rem',
      header: 'Collection',
      content: (
        <Form labelWidth="5rem" data={data} initValidate onSubmit={this.handleSave}>
          <FormControl label="Code" required max={20}
            type="alphanum" name="code"
            trigger="blur"
            validator={{ async: this.checkCode }}
          />
          <FormControl label="Name" required max={20} type="text" name="name" />
          <FormControl label="Description" rows={5} max={100} type="textarea" name="desc" />
        </Form>
      )
    })
  }

  handleSave (data) {
    this.props.dispatch(saveCollection(data, () => {
      Modal.close(this.mid)
    }))
  }

  handleRemove (item) {
    Modal.confirm(`确定删除 ${item.name} 吗`, () => {
      this.props.dispatch(removeCollection(item._id))
    }, '删除')
  }

  render () {
    return (
      <div>
        <Breadcrumb style={{background: '#fff'}} data={[{text: 'Collections'}]} />

        <Card style={{padding: '2rem'}}>
          <div style={{marginBottom: '2rem'}} className={_styles['tab-buttons']}>
            <Button status="success"
              onClick={this.handleEdit.bind(this, undefined)}>
              <Icon icon="plus" />
              New Collection
            </Button>
          </div>

          <Table data={this.props.data}
            columns={[
              { sort: true, header: 'Code', content: d => (
                <Link to={`/schema/${d.code}`}>{d.code}</Link>
              ) },
              { name: 'name', header: 'Name' },
              { name: 'desc', header: 'Description' },
              { name: 'updateAt', sort: true, width: '12rem', header: 'UpdateAt', content: d => Datetime.format(d.updateAt, 'yyyy-MM-dd hh:mm:ss') },
              { width: '6rem', content: d => (
                <span>
                  <Link to={`/schema/${d.code}`}>
                    <Tooltip position="top" tip="detail">
                      <Icon icon="list" />
                    </Tooltip>
                  </Link>
                  {' '}
                  <a href="javascript:;" onClick={this.handleEdit.bind(this, d)}>
                    <Tooltip position="top" tip="edit">
                      <Icon icon="edit" />
                    </Tooltip>
                  </a>
                  {' '}
                  <a href="javascript:;" onClick={this.handleRemove.bind(this, d)}>
                    <Tooltip position="top" tip="remove">
                      <Icon icon="trash" />
                    </Tooltip>
                  </a>
                </span>
              )}
            ]}
            pagination={{ size: 20 }}
          />
        </Card>
      </div>
    )
  }
}

Collection.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element
  ]),
  dispatch: PropTypes.func
}

const mapStateToProps = state => {
  const { schemas } = state
  return { ...schemas }
}

export default connect(mapStateToProps)(Collection)
