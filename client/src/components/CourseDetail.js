import React, { useState, useContext, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Cookies from 'js-cookie';
import { Link, useParams, useHistory } from 'react-router-dom'
import { Context } from '../Context';
import CourseLink from './CourseLink';

export default function Public() {
    const { id } = useParams();
    let context = useContext(Context);
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState({});
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        context.actions.loadCourses()
            .then(data => {
                setCourse(data[id - 1]);
                setLoading(false);
            })
            .catch(err => console.log(err))
    }, [])

    const deleteCourse = () => {
        context.actions.deleteCourse(course, id, context.authenticatedUser.username, context.password)
            .then(data => {
                if (data) {
                    setErrors(data)
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
                        {console.log(course)}
                        <div className="actions--bar">
                            <div className="wrap">
                                {
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