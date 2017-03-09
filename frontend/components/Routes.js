import { Route, IndexRoute } from 'react-router'

import App from './App'
import Collections from './Collections'
import Schema from './Schema'
import Api from './Api'
import ApiEdit from './Api/Edit'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Collections} />
    <Route path="collections" component={Collections} />
    <Route path="schema/:code(/:tab)" component={Schema} />
    <Route path="api" component={Api} />
    <Route path="api/:id" component={ApiEdit} />
  </Route>
)

