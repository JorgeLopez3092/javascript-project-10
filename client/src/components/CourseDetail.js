import React, { useState, useContext, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useParams, useHistory } from 'react-router-dom'
import { Context } from '../Context';

export default function Public() {
    const { id } = useParams();
    let context = useContext(Context);
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState({});
    let errors;

    // Grab list of courses
    useEffect(() => {
        context.actions.loadCourses()
            .then(data => {
                // grab course with same id as visited link parameter
                const correctCourse = data.filter(course => course.id === parseInt(id))
                if (correctCourse.length > 0) {
                    setCourse(correctCourse[0])
                    setLoading(false);
                } else {
                    // if there is no course with the same id as the id parameter
                    history.push('/notfound')
                }
            })
            .catch(err => {
                console.error(err)
                // for any errors not handled manually
                    history.push('/error');
            })
    }, [])

    // calling delete function from context.  requires credentials
    const deleteCourse = () => {
        context.actions.deleteCourse(course, id, context.authenticatedUser.username, context.password)
            .then(data => {
                if (data) {
                    errors = data
                    console.error(errors);
                } else {
                    history.push(`/`);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <main>
            {
                loading
                    ?
                    <h1>Loading...</h1>
                    :
                    <React.Fragment>
                        <div className="actions--bar">
                            <div className="wrap">
                                {   // checks whether to show update and delete buttons based on authentication and ownership
                                    context.authenticatedUser && context.authenticatedUser.id === course.teacher.id
                                        ?
                                        <>
                                            <Link className="button" to={`/courses/${id}/update`} >Update Course</Link>
                                            <button className="button" onClick={deleteCourse}>Delete Course</button>
                                        </>
                                        :
                                        null
                                }
                                <Link className="button button-secondary" to="/">Return to List</Link>
                            </div>
                        </div>

                        <div className="wrap">
                            <h2>Course Detail</h2>
                            <form>
                                <div className="main--flex">
                                    <div>
                                        <h3 className="course--detail--title">Course</h3>
                                        <h4 className="course--name">{course.title}</h4>
                                        <p>By {course.teacher.firstName} {course.teacher.lastName}</p>

                                        <ReactMarkdown>{course.description}</ReactMarkdown>
                                    </div>
                                    <div>
                                        <h3 className="course--detail--title">Estimated Time</h3>
                                        {
                                            course.estimatedTime === ""
                                                ?
                                                <p>N/A</p>
                                                :
                                                <p>{course.estimatedTime}</p>
                                        }

                                        <h3 className="course--detail--title">Materials Needed</h3>
                                        <ul className="course--detail--list">
                                            <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>
                                        </ul>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </React.Fragment>
            }
        </main>
    )
}