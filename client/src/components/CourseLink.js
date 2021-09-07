import React from 'react'
import { Link } from 'react-router-dom';

export default function CourseLink(props) {
    const id = props.id;
    return (
            <Link className="course--module course--link" to={`course/${id}`}>
                <h2 className="course--label">Course</h2>
                <h3 className="course--title">{props.title}</h3>
            </Link>
    )
}