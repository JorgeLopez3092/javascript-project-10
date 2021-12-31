import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Context } from '../Context';

/* Used for routes that require authentication to be accessed
   Redirects user to /signin page if not authenticated then back
   to page that was initially being accessed. */

export default function PrivateRoute({ component: Component, ...rest }) {
  const context = useContext(Context);
  return (
        <Route
          {...rest}
          render={props => context.authenticatedUser ? (
              <Component {...props} />
            ) : (
              <Redirect to={{
                pathname: '/signin',
                state: { from: props.location }
              }} />
            )
          }
        />
  );
};