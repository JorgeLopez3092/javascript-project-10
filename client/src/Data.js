import config from './config';

export default class Data {
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  async getUser(username, password) {
    const credentials = {
      username,
      password
    }
    const response = await this.api(`/users`, 'GET', null, true, credentials);
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }

  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  async getCourses() {
    const response = await this.api('/courses', 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);
    } else if (response.status !== 200) {
      throw new Error();
    }
  }

  async postCourse(course, username, password) {
    const credentials = {
      username,
      password
    }
    const response = await this.api('/courses', 'POST', course, true, credentials);
    if (response.status === 201) {
      return [];
    }else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error();
    }
  }

  async putCourse(course, courseId, username, password) {
    const credentials = {
      username, password
    };
    const response = await this.api(`/courses/${courseId}`, 'PUT', course, true, credentials);
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error();
    }
  }

  async deleteCourse(course, courseId, username, password) {
    const credentials = {
      username, password
    };
    const response = await this.api(`/courses/${courseId}`, 'DELETE', null, true, credentials);
    if (response.status === 204) {
      return [];
    } else if (response.status === 403) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error();
    }
  }
}
