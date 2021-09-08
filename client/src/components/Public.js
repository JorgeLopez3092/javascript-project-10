import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Context } from '../Context';
import CourseLink from './CourseLink';

export default function Public() {
    let context = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        context.actions.loadCourses()
            .then(data => {
                setCourses(data);
                setLoading(false);
            })
            .catch(err => console.log(err));
    }, [])

    return (
        <main>
            <div className="wrap main--grid">
                {
                    loading
                        ?
                        <h1>Loading...</h1>
                        :
                        courses.map(course =>
                            <CourseLink title={course.title} key={course.id} id={course.id} />
                        )
                }
                <Link className="course--module course--add--module" to="/create-course">
                    <span className="course--add--title">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        viewBox="0 0 13 13" className="add"><polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon></svg>
                        New Course
                    </span>
                </Link>
            </div>
        </main>
    )
}