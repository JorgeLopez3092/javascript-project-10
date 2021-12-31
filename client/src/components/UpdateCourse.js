import React, { useState, useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import { Context } from '../Context';
import Form from './Form';

export default function SignUp() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState({});
    let [title, setCourseTitle] = useState('');
    let [description, setCourseDescription] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [materialsNeeded, setMaterialsNeeded] = useState('');
    const [errors, setErrors] = useState([]);
    let context = useContext(Context);
    let history = useHistory();

    useEffect(() => {
        const controller = new AbortController();
        let correctCourse;
        let formDiv = document.getElementsByClassName('form--centered');
        let authenticated = true;
        context.actions.loadCourses()
            .then(data => {
                // ensures that we are connected to the correct course based on id URL parameter
                const courseCheck = data.find(course => course.id === parseInt(id))
                const teacherCheck = courseCheck.teacher
                // checks if current authenticated user is owner of course through id
                if (context.authenticatedUser.id !== teacherCheck.id) {
                    authenticated = false;
                    history.push('/forbidden');
                }
                return data
            })
            .then(data => {
                // grabs index of course from data array (which carries an array of all the courses)
                correctCourse = data.filter(course => course.id === parseInt(id))
                if (correctCourse.length === 0) {
                    history.push('/notfound');
                }
                setCourse(correctCourse[0])
                setCourseTitle(course.title)
                setCourseDescription(course.description)
                return correctCourse
            })
            .catch(err => {
                // for any errors not already handled manually
                console.error(err);
                history.push('/error')
            })
            .finally(() => {
                // abort react rendering if course does not exist before rerouting to /notfound
                if (!correctCourse) {
                    controller.abort();
                    history.push('/notfound');
                }
                // renders form and styles it once everything has been loaded correctly.
                setLoading(false);
                formDiv = formDiv[0] || null;
                if (formDiv) {
                    formDiv.classList.add('wrap');
                    formDiv.classList.remove('form--centered')
                }
            });
    }, [id]);

    // update correct field and the state thats tracking its value
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
        /* since the state starts off empty up top, if no changes are made to the required title and description forms 
            then the state stays empty and never gets updated with change function.  These checks ensure that the
            state variables get filled with course object values if unchanged.  required for successful api call. */
        if (!title) {
            const stillTitle = document.getElementById('title').value;
            title = stillTitle
        }

        if (!description) {
            const stillDesc = document.getElementById('description').value;
            description = stillDesc
        }

        // object to pass api
        const updatedCourse = {
            title,
            description,
            estimatedTime,
            materialsNeeded,
        };

        context.actions.updateCourse(updatedCourse, id, context.authenticatedUser.username, context.password)
            .then(data => {
                if (data) {
                    setErrors(data)
                } else {
                    history.push(`/courses/${id}`);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    // this cancel sends user back to the coursedetail page of the same course
    const cancel = () => {
        history.push(`/courses/${id}`);
    }
    // built on Form template component
    return (
        <main>
            {
                loading
                    ?
                    <h1>Loading...</h1>
                    :
                    <div className="form--centered">
                        <h2>Update Course</h2>
                        <Form
                            cancel={cancel}
                            errors={errors}
                            submit={submit}
                            submitButtonText="Update Course"
                            elements={() => (
                                <React.Fragment>
                                    <div className="main--flex">
                                        <div>
                                            <label htmlFor="title">Course Title</label>
                                            <input id="title" name="title" type="text" defaultValue={course.title} onChange={change} />

                                            <p>By {context.authenticatedUser.name}</p>

                                            <label htmlFor="courseDescription">Course Description</label>
                                            <textarea id="description" name="description" defaultValue={course.description} onChange={change}></textarea>
                                        </div>
                                        <div>
                                            <label htmlFor="estimatedTime">Estimated Time</label>
                                            <input id="estimatedTime" name="estimatedTime" defaultValue={course.estimatedTime} type="text" onChange={change} />

                                            <label htmlFor="materialsNeeded">Materials Needed</label>
                                            <textarea id="materialsNeeded" name="materialsNeeded" defaultValue={course.materialsNeeded} onChange={change}></textarea>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                        />
                    </div>
            }
        </main>
    )
}