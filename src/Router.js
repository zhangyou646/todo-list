//引入react jsx写法的必须
import React from 'react'
//引入需要用到的页面组件 
// import Home from './containers/home';
// import Todo from './Containers/todo';
// import Home from './Containers/home';
//引入一些模块
// import { BrowserRouter as Router, Route} from "react-router-dom";

import {HashRouter as Router, Switch, Route} from 'react-router-dom'
import loadable from '@loadable/component'

// function router(){
// return (
//   <Router>
//       {/* <Route path="/home" component={Home} /> */}
//       <Route path="home" getComponent={() => System.import('./containers/Home')} />
//       {/* <Route path='/home' component={loadable(() => import('./Containers/todo.js'))}/> */}
//       {/* <Route path="/todo" component={Todo} /> */}
//   </Router>);
// }

class router extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={loadable(() => import('./containers/todo/TodoList.js'))}/>
          <Route path='/home' component={loadable(() => import('./containers/home/Home.js'))}/>
          <Route path='/todo' component={loadable(() => import('./containers/todo/TodoList.js'))}/>
          <Route component={loadable(() => import('./containers/404/index.js'))}/>
        </Switch>
      </Router>
    )
  }
}

export default router;