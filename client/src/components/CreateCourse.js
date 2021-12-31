import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { Context } from '../Context';
import Form from './Form';

export default function SignUp() {
    useEffect(() => {
        let formDiv = document.getElementsByClassName('form--centered');
        formDiv = formDiv[0];
        formDiv.classList.add('wrap');
        formDiv.classList.remove('form--centered')
    }, []);
    let context = useContext(Context);
    let history = useHistory();
    const [title, setCourseTitle] = useState('');
    const [description, setCourseDescription] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [materialsNeeded, setMaterialsNeeded] = useState('');
    const [errors, setErrors] = useState([]);

    // update the state and each field depending on which field is selected.
    const change = (event) => {
        const value = event.target.value;
        switch (event.target.name) {
            case "title":
                setCourseTitle(value);
                break;
            case "description":
                setCourseDescription(value);
                break;
            case "estimatedTime":
                setEstimatedTime(value);
                break;
            case "materialsNeeded":
                setMaterialsNeeded(value);
                break;
            default:
                return;
        }
    }

    const submit = () => {
        // create course object for api call
        const course = {
            title,
            description,
            estimatedTime,
            materialsNeeded,
        };

        context.actions.createCourse(course, context.authenticatedUser.username, context.password)
            .then(data => {
                console.log(data);
                if (data) {
                    setErrors(data)
                } else {
                    history.push('/');
                }
            })
            .catch(err => {
                console.log(err);
                history.push('/error');
            });
    }

    const cancel = () => {
        history.push('/');
    }

    // built off Form component.
    return (
        <main>
            <div className="form--centered">
                <h2>Create Course</h2>
                <Form
                    cancel={cancel}
                    errors={errors}
                    submit={submit}
                    submitButtonText="Create Course"
                    elements={() => (
                        <React.Fragment>
                            <div className="main--flex">
                                <div>
                                    <label htmlFor="title">Course Title</label>
                                    <input id="title" name="title" type="text" onChange={change} />

                                    <p>By {context.authenticatedUser.name}</p>

                                    <label htmlFor="courseDescription">Course Description</label>
                                    <textarea id="description" name="description" onChange={change}></textarea>
                                </div>
                                <div>
                                    <label htmlFor="estimatedTime">Estimated Time</label>
                                    <input id="estimatedTime" name="estimatedTime" type="text" onChange={change} />

                                    <label htmlFor="materialsNeeded">Materials Needed</label>
                                    <textarea id="materialsNeeded" name="materialsNeeded" onChange={change}></textarea>
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                />
            </div>
        </main>
    )
}