import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

export const Context = React.createContext();

export class Provider extends Component {

    state = {
        authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
        courses: []
    };

    constructor() {
        super();
        this.data = new Data();
    }

    render() {
        const { authenticatedUser, courses } = this.state;
        const value = {
            authenticatedUser,
            courses,
            data: this.data,
            actions: {
                signIn: this.signIn,
                signOut: this.signOut,
                loadCourses: this.loadCourses,
            },
        };
        return (
            <Context.Provider value={value}>
                {this.props.children}
            </Context.Provider>
        );
    }

    loadCourses = async () => {
        let courses = await this.data.getCourses()
            .then(res => res)
            .catch(err => console.log(err));
        if (courses.length > 0) {
            this.setState(() => {
                return {
                    ...this.state,
                    courses: courses.map(data => {
                        const course = {
                            id: data.id,
                            title: data.title,
                            description: data.description,
                            estimatedTime: data.estimatedTime,
                            materialNeeded: data.materialNeeded,
                            teacher: `${data.teacher.firstName} ${data.teacher.lastName}`
                        }
                        return course;
                    })
                }
            })
        }
        return courses;
    }

    signIn = async (username, password) => {
        const user = await this.data.getUser(username, password);
        if (user !== null) {
            this.setState(() => {
                return {
                    authenticatedUser: user,
                    ...this.state
                };
            });
            const cookieOptions = {
                expires: 1 // 1 day
            };
            Cookies.set('authenticatedUser', JSON.stringify(user), { cookieOptions });
        }
        return user;
    }

    signOut = () => {
        this.setState({ authenticatedUser: null });
        Cookies.remove('authenticatedUser');
    }
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
