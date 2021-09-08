import React, { useState, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'
import { Context } from '../Context';
import CourseLink from './CourseLink';

export default function Public() {
    const { id } = useParams();
    let context = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState({});

    useEffect(() => {
        context.actions.loadCourses()
            .then(data => {
                setCourses(data);
                setCourse(data[id - 1]);
                setLoading(false);
            })
            .catch(err => console.log(err))
            .finally(data => console.log(course));
    }, [])

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
                                <Link className="button" to="update-course.html">Update Course</Link>
                                <Link className="button" to="#">Delete Course</Link>
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

                                        <p>{course.description}</p>
                                    </div>
                                    <div>
                                        <h3 className="course--detail--title">Estimated Time</h3>
                                        <p>14 hours</p>

                                        <h3 className="course--detail--title">Materials Needed</h3>
                                        <ul className="course--detail--list">
                                            <li>1/2 x 3/4 inch parting strip</li>
                                            <li>1 x 2 common pine</li>
                                            <li>1 x 4 common pine</li>
                                            <li>1 x 10 common pine</li>
                                            <li>1/4 inch thick lauan plywood</li>
                                            <li>Finishing Nails</li>
                                            <li>Sandpaper</li>
                                            <li>Wood Glue</li>
                                            <li>Wood Filler</li>
                                            <li>Minwax Oil Based Polyurethane</li>
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