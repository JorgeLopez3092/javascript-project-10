import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { Context } from '../Context';

// sign out button leads here.  clears cookies
// also reroutes to main page which causes a quick refresh that ensures cookies are cleared from dev tools.
export default function UserSignOut(props) {
    const context = useContext(Context);
    let history = useHistory();

    useEffect(() => {
        context.actions.signOut()
        history.push('/')
    } )

    return (
        <>
        </>
    )
}