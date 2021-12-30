import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { Context } from '../Context';

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