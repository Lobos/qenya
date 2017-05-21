import React from 'react'
import PropTypes from 'prop-types'
import { FormControl, Checkbox, Input, RadioGroup } from 'rctui'

function DataSource(props, context) {
  const { type, sourceType, mult } = context.formData
  const { code } = props

  const cols = {}
  props.schemas.forEach((s) => {
    if (s.code !== code) cols[s.code] = s.name
  })

  if (['enum'].indexOf(type) < 0) return <span />

  return (
    <div>
      <FormControl>
        <Checkbox name="mult">多选</Checkbox>
        {
          mult &&
          <label style={{ margin: 0 }}>
            <span style={{ verticalAlign: 'middle' }}>分割符</span>&nbsp;<Input style={{ width: 60 }} type="text" name="sep" />
          </label>
        }
      </FormControl>

      <FormControl
        required label="数据源" type="radio-group" name="sourceType" data={[
        { id: 'json', text: '静态数据' },
        { id: 'ref', text: '关联表' },
        // { id: 'url', text: '远程' }
        ]}
      />

      {
        sourceType === 'json' &&
        <FormControl
          key="sourceJson" label="数据选项" required type="json" valueType="object" name="sourceJson" rows={8}
          tip={<span>json格式，<a target="_blank" href="http://lobos.github.io/react-ui/0.7/#/select">数据结构见这里</a></span>}
        />
      }

      {
        sourceType === 'ref' &&
        <FormControl key="sourceRef" grid={1 / 2} label="Collection" name="sourceRef" required data={cols} type="select" />
      }

      {
        sourceType === 'ref' &&
        <FormControl label="数据类型">
          <RadioGroup name="renderType" data={['json', 'graphql']} defaultValue="json" />
        </FormControl>
      }

      {
        sourceType === 'url' &&
        <FormControl key="sourceUrl" grid={1} required label="数据地址" type="text" name="sourceUrl" />
      }

      <FormControl
        value={sourceType === 'ref' ? '{_id}' : undefined}
        label="ValueTpl" grid={1} type="text" name="valueTpl"
      />

      <FormControl label="OptionTpl" required={sourceType === 'ref'} grid={1} type="text" name="optionTpl" />
    </div>
  )
}

DataSource.propTypes = {
  code: PropTypes.string,
  schemas: PropTypes.array,
}

DataSource.contextTypes = {
  formData: PropTypes.object,
}

export default DataSource
