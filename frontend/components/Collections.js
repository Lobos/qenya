import { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
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
      callback(new Error('code 只能由英文字符、数字、下划线组成'))
    } else if (value.length > 20) {
      callback(new Error('code 不能超过20个字符'))
    } else {
      Refetch.post('/schema/exist', { _id: formData._id, code: value })
        .then(res => {
          if (res.success) callback(true)
          else callback(new Error('code 已经存在'))
        })
    }
  }

  handleEdit (data) {
    this.mid = Modal.open({
      buttons: {
        '提交': 'submit',
        '取消': true
      },
      padding: '2rem',
      width: '40rem',
      header: `${data ? '编辑' : '新建'} Collection`,
      content: (
        <Form labelWidth="5rem" data={data} initValidate onSubmit={this.handleSave}>
          <FormControl label="Code" required max={20}
            type="alphanum" name="code"
            trigger="blur"
            validator={{ async: this.checkCode }}
          />
          <FormControl label="名称" required max={20} type="text" name="name" />
          <FormControl label="描述" rows={5} max={100} type="textarea" name="desc" />
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
              新建Collection
            </Button>
          </div>

          <Table data={this.props.data}
            columns={[
              { sort: true, header: 'Code', content: d => (
                <Link to={`/schema/${d.code}`}>{d.code}</Link>
              ) },
              { name: 'name', header: '名称' },
              { name: 'desc', header: '描述' },
              { name: 'updateAt', sort: true, width: '12rem', header: '更新时间', content: d => Datetime.format(d.update_at, 'yyyy-MM-dd hh:mm:ss') },
              { width: '6rem', content: d => (
                <span>
                  <Link to={`/schema/${d.code}`}>
                    <Tooltip position="top" tip="字段">
                      <Icon icon="list" />
                    </Tooltip>
                  </Link>
                  {' '}
                  <a href="javascript:;" onClick={this.handleEdit.bind(this, d)}>
                    <Tooltip position="top" tip="编辑">
                      <Icon icon="edit" />
                    </Tooltip>
                  </a>
                  {' '}
                  <a href="javascript:;" onClick={this.handleRemove.bind(this, d)}>
                    <Tooltip position="top" tip="删除">
                      <Icon icon="trash" />
                    </Tooltip>
                  </a>
                </span>
              )}
            ]}
            pagination={{ size: 10 }}
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
