import React, { useState, useContext, useEffect } from 'react';
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
            </div>
        </main>
    )
}