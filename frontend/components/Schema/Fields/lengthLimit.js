import React from 'react'
import { Grid, FormControl } from 'rctui'

const NONETYPE = ['text', 'integer', 'number']

export default function (type) {
  if (NONETYPE.indexOf(type) < 0) return undefined

  const suf = (type === 'integer' || type === 'number') ? '值' : '长度'
  const gs = [
    <Grid key="min" width={1 / 3}>
      <FormControl label={`最小${suf}`} grid={1} type="integer" name="min" />
    </Grid>,
    <Grid key="max" width={1 / 3}>
      <FormControl label={`最大${suf}`} grid={1} type="integer" name="max" defaultValue={20} />
    </Grid>,
  ]

  if (type === 'number') {
    gs.push(<Grid key="fixed" width={1 / 3}>
      <FormControl label="小数位数" grid={1} type="integer" name="fixed" />
    </Grid>)
  }

  return gs
}
