import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/Header';
import Public from './components/Public';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import PrivateRoute from './components/PrivateRoute';
// import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Header />

        <Switch>
          <Route exact path="/" component={Public} />
          <Route path="/signup" component={UserSignUp} />
          <Route path="/signin" component={UserSignIn} />
          <PrivateRoute path="/courses/:id/update" component={UpdateCourse} />
          <PrivateRoute path="/courses/create" component={CreateCourse} />
          <Route path="/courses/:id" component={CourseDetail} />

          {/* <PrivateRoute path="/authenticated" component={Authenticated} />
        <Route path="/signout" component={UserSignOutWithContext} />
        <Route component={NotFound} /> */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
