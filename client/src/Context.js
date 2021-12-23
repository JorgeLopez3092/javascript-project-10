import React, { useState, Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

export const Context = React.createContext();

export const Provider = ({ children }) => {
    const [data, setData] = useState(new Data());
    const [authenticatedUser, setAuthenticatedUser] = useState(Cookies.getJSON('authenticatedUser') || null);
    const [password, setPassword] = useState(Cookies.get('userPassword') || null);
    const [courses, setCourses] = useState([]);

    const loadCourses = async () => {
        let courses = await data.getCourses()
            .then(res => res)
            .catch(err => console.log(err));
        if (courses.length > 0) {
            setCourses(courses.map(data => {
                const course = {
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    estimatedTime: data.estimatedTime,
                    materialNeeded: data.materialNeeded,
                    teacher: `${data.teacher.firstName} ${data.teacher.lastName}`
                }
                return course;
            }))
        }
        return courses;
    }

    const createCourse = async (course, username, password) => {
        let userId;
        let errors;
        await data.getUser(username, password)
            .then(data => {
                userId = data.id
            })
            .catch(err => err);
        console.log(course);
        await data.postCourse(course, username, password)
            .then(data => {
                if (data.length) {
                    errors = data
                }
            })
            .catch(err => err);
        return errors;
    }

    const updateCourse = async (course, courseId, username, password) => {
        let userId
        let errors
        await data.getUser(username, password)
            .then(data => {
                userId = data.id
            })
            .catch(err => err);
        course = {
            userId,
            ...course,
        }
        await data.putCourse(course, courseId, username, password)
            .then(data => {
                if (data.length) {
                    errors = data
                }
            })
            .catch(err => err);
        return errors;
    }

    const deleteCourse = async (course, courseId, username, password) => {
        let userId
        let errors
        await data.getUser(username, password)
            .then(data => {
                userId = data.id
            })
            .catch(err => err);
        course = {
            userId,
            ...course,
        }
        await data.deleteCourse(course, courseId, username, password)
            .then(data => {
                if (data.length) {
                    errors = data
                }
            })
            .catch(err => err);
        return errors;
    }

    const signIn = async (username, password) => {
        const user = await data.getUser(username, password);
        if (user !== null) {
            setAuthenticatedUser(user);
            setPassword(password);
            const cookieOptions = {
                expires: 1 // 1 day
            };
            Cookies.set('authenticatedUser', JSON.stringify(user));
            Cookies.set('userPassword', password);
        }
        return user;
    }

    const signOut = () => {
        setAuthenticatedUser(null);
        setPassword(null);
        Cookies.remove('authenticatedUser');
    }

    const value = {
        authenticatedUser,
        password,
        courses,
        data,
        actions: {
            signIn,
            signOut,
            loadCourses,
            createCourse,
            updateCourse,
            deleteCourse,
        },
    }

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export function withContext(Component) {
    return function ContextComponent(props) {
        return (
            <Context.Consumer>
                {context => <Component {...props} context={context} />}
            </Context.Consumer>
        );
    }
}

export default { withContext, Context }
