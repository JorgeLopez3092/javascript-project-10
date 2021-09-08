import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { Context } from '../Context';
import Form from './Form';

export default function SignIn() {
    let context = useContext(Context);
    let history = useHistory();
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPass] = useState('');
    const [errors, setErrors] = useState([]);
    const change = (event) => {
        const value = event.target.value;
        switch (event.target.name) {
            case "emailAddress":
                setEmailAddress(value);
                break;
            case "password":
                setPass(value);
                break;
            default:
                return;
        }
    }

    const submit = () => {
        context.actions.signIn(emailAddress, password)
            .then((user) => {
                if (user === null) {
                    setErrors([...errors, 'Sign-in was unsuccessful']);
                } else {
                    history.push('/');
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.error(error);
                history.push('/error');
            });
    }

    const cancel = () => {
        history.push('/');
    }

    return (
        <main>
            <div className="form--centered">
                <h2>Sign Up</h2>
                <Form
                    cancel={cancel}
                    errors={errors}
                    submit={submit}
                    submitButtonText="Sign In"
                    elements={() => (
                        <React.Fragment>
                            <label htmlFor="emailAddress">Email Address</label>
                            <input id="emailAddress" name="emailAddress" type="email" onChange={change} />
                            <label htmlFor="password">Password</label>
                            <input id="password" name="password" type="password" onChange={change} />
                        </React.Fragment>
                    )}
                />
                <p>Don't have a user account? Click here to <Link to="/signup">sign up</Link>!</p>
            </div>
        </main>
    )
}