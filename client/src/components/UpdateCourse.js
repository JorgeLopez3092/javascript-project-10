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
                const courseCheck = data.find(course => course.id === parseInt(id))
                const teacherCheck = courseCheck.teacher
                if (context.authenticatedUser.id !== teacherCheck.id) {
                    authenticated = false;
                    history.push('/forbidden');
                }
                return data
            })
            .then(data => {
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
                console.error(err);
                history.push('/error')
            })
            .finally(() => {
                if (!correctCourse) {
                    controller.abort();
                    history.push('/notfound');
                }
                setLoading(false);
                formDiv = formDiv[0] || null;
                if (formDiv) {
                    formDiv.classList.add('wrap');
                    formDiv.classList.remove('form--centered')
                }
            });
        return () => {
            if (!authenticated) {
                controller.abort();
            }
        }

    }, [id]);


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
        console.log(title);
        if (!title) {
            const stillTitle = document.getElementById('title').value;
            title = stillTitle
        }

        if (!description) {
            const stillDesc = document.getElementById('description').value;
            description = stillDesc
        }


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

    const cancel = () => {
        history.push(`/courses/${id}`);
    }

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