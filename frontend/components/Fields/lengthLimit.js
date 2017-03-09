import { Grid, FormControl } from 'rctui'

const NONETYPE = ['text', 'integer', 'number']

export default function (type) {
  if (NONETYPE.indexOf(type) < 0) return

  let suf = (type === 'integer' || type === 'number') ? '值' : '长度'
  return [
    <Grid key="min" width={1 / 2}>
      <FormControl label={`最小${suf}`} grid={1} type="integer" name="min" />
    </Grid>,
    <Grid key="max" width={1 / 2}>
      <FormControl label={`最小${suf}`} grid={1} type="integer" name="max" defaultValue={20} />
    </Grid>
  ]
}
