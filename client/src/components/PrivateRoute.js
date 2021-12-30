import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Context } from '../Context';

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