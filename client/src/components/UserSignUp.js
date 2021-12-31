import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { Context } from '../Context';
import Form from './Form';

export default function SignUp(props) {
    let context = useContext(Context);
    let history = useHistory();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPass] = useState('');
    const [errors, setErrors] = useState([]);
    // update correct field and state holding its value
    const change = (event) => {
        const value = event.target.value;
        switch (event.target.name) {
            case "firstName":
                setFirstName(value);
                break;
            case "lastName":
                setLastName(value);
                break;
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
        // for PrivateRoute.  Will take use back to where they were before being prompted to sign in.
        const { from } = props.location.state || { from: { pathname: '/' } };
        const user = {
            firstName,
            lastName,
            emailAddress,
            password,
        };
        // api call to create user
        context.data.createUser(user)
            .then(errors => {
                if (errors.length) {
                    setErrors(errors);
                } else {
                    // if create user is successful, this is an api call to sign the user in using same credentials just set.
                    context.actions.signIn(emailAddress, password)
                        .then((user) => {
                            if (user === null) {
                                setErrors(['Sign-in was unsuccessful']);
                            } else {
                                history.push(from);
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            history.push('/error');
                        });
                }
            })
            .catch((err) => {
                console.log(err);
                history.push('/error');
            })
    }
    // cancel only needs to send you back to homepage.
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
                    submitButtonText="Sign Up"
                    elements={() => (
                        <React.Fragment>
                            <label htmlFor="firstName">First Name</label>
                            <input id="firstName" name="firstName" type="text" onChange={change} />
                            <label htmlFor="lastName">Last Name</label>
                            <input id="lastName" name="lastName" type="text" onChange={change} />
                            <label htmlFor="emailAddress">Email Address</label>
                            <input id="emailAddress" name="emailAddress" type="email" onChange={change} />
                            <label htmlFor="password">Password</label>
                            <input id="password" name="password" type="password" onChange={change} />
                        </React.Fragment>
                    )}
                />
                <p>Already have a user account? Click here to <Link to="/signin">sign in</Link>!</p>

            </div>
        </main>
    )
}