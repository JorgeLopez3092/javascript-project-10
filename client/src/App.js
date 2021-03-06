import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/Header';
import Courses from './components/Courses';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import PrivateRoute from './components/PrivateRoute';

import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';
// import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Header />

        <Switch>
          <Route exact path="/" component={Courses} />
          <Route path="/signup" component={UserSignUp} />
          <Route path="/signin" component={UserSignIn} />
          <Route path="/signout" component={UserSignOut} />
          <PrivateRoute path="/courses/:id/update" component={UpdateCourse} />
          <PrivateRoute path="/courses/create" component={CreateCourse} />
          <Route path="/courses/:id" component={CourseDetail} />
          <Route path="/forbidden" component={Forbidden} />
          <Route path="/error" component={UnhandledError} />
          {/* For redirects */}
          <Route path="/notfound" component={NotFound} />
          {/* For manually typed non-existent URLs */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
