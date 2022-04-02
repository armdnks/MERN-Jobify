## MERN Stack Course 2022 - MongoDB, Express, React and NodeJS

### by John Smilga on Udemy

---

#### LAST COURSE

- 139. Get All Jobs Controller

##### IMPORTANT COURSE

- Section 28 | Axios Setup

---

#### Error: listen EADDRINUSE: address already in use :::5000

```sh
Terminal

lsof -i tcp:5000
kill -9 {PID}
```

---

#### Project Setup

- remove .git
- client terminal
- ls -a
- rm -rf .git
- move .gitignore to root folder

```sh
.gitignore

node_modules
node_modules/
.env
```

---

#### Setup concurrently

```js
package.json

  "scripts": {
    "start": "node backend/server",
    "server": "nodemon backend/server --ignore client",
    "client": "npm start --prefix client",
    "dev": "concurrently -kill-others-on-fail \"npm run server\" \"npm run client\""
  },
```

---

#### Support Link

```sh
Free SVG
https://undraw.co/illustrations

Key Generator | Encryption Keys | 256-bit
https://www.allkeysgenerator.com
```

---

#### React Js 17

```js
"@testing-library/jest-dom": "^5.15.0",
"@testing-library/react": "^11.2.7",
"@testing-library/user-event": "^12.8.3",
"react": "^17.0.2",
"react-dom": "^17.0.2",
"react-scripts": "4.0.3",
```

#### React Js 18

```js
"@testing-library/jest-dom": "^5.16.3",
"@testing-library/react": "^12.1.4",
"@testing-library/user-event": "^13.5.0",
"react": "^18.0.0",
"react-dom": "^18.0.0",
"react-scripts": "5.0.0",
```

---

#### Authenticate User Setup

- Jobify MERN README.md row 1997 ( **two options** )

```js
server.js;

import authenticateUser from './middleware/auth.js';
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
```

##### or

```js
jobsRoutes.js;

import authenticateUser from './middleware/auth.js';
// all routes !!!!
router.route('/stats').get(authenticateUser, showStats);
```

---

#### Before Refactor

##### Register and Login

```js
context / actions.js;

export const REGISTER_USER_BEGIN = 'REGISTER_USER_BEGIN';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_ERROR = 'REGISTER_USER_ERROR';

export const LOGIN_USER_BEGIN = 'LOGIN_USER_BEGIN';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';
```

##### import actions to reducers.js

```js
context / reducers.js;

if (action.type === REGISTER_USER_BEGIN) {
  return {
    ...state,
    isLoading: true,
  };
}
if (action.type === REGISTER_USER_SUCCESS) {
  return {
    ...state,
    isLoading: false,
    user: action.payload.user,
    token: action.payload.token,
    userLocation: action.payload.location,
    jobLocation: action.payload.location,
    showAlert: true,
    alertType: 'success',
    alertText: 'User Created! Redirecting...',
  };
}
if (action.type === REGISTER_USER_ERROR) {
  return {
    ...state,
    isLoading: false,
    showAlert: true,
    alertType: 'danger',
    alertText: action.payload.message,
  };
}

if (action.type === LOGIN_USER_BEGIN) {
  return {
    ...state,
    isLoading: true,
  };
}
if (action.type === LOGIN_USER_SUCCESS) {
  return {
    ...state,
    isLoading: false,
    user: action.payload.user,
    token: action.payload.token,
    userLocation: action.payload.location,
    jobLocation: action.payload.location,
    showAlert: true,
    alertType: 'success',
    alertText: 'Login Successful! Redirecting...',
  };
}
if (action.type === LOGIN_USER_ERROR) {
  return {
    ...state,
    isLoading: false,
    showAlert: true,
    alertType: 'danger',
    alertText: action.payload.message,
  };
}
```

##### import actions to appContext.js

```js
context / appContext.js;

async function registerUser(currentUser) {
  dispatch({ type: REGISTER_USER_BEGIN });
  try {
    const response = await axios.post('api/v1/auth/register', currentUser);
    const { user, token, location } = response.data;
    dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: { user, token, location },
    });

    addUserToLocalStorage({ user, token, location });
  } catch (error) {
    dispatch({
      type: REGISTER_USER_ERROR,
      payload: { message: error.response.data.message },
    });
  }
  clearAlert();
}

async function loginUser(currentUser) {
  dispatch({ type: LOGIN_USER_BEGIN });
  try {
    const response = await axios.post('api/v1/auth/login', currentUser);
    const { user, token, location } = response.data;
    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: { user, token, location },
    });

    addUserToLocalStorage({ user, token, location });
  } catch (error) {
    dispatch({
      type: LOGIN_USER_ERROR,
      payload: { message: error.response.data.message },
    });
  }
  clearAlert();
}

const value = { registerUser, loginUser };
```

##### import functions to Register.js

```js
pages / Register.js;

const { registerUser, loginUser } = useAppContext();
.
.
const currentUser = { name, email, password };
if (isMember) {
  loginUser(currentUser);
} else {
  registerUser(currentUser);
}
```

- Clean code goes to Section 19 | Course 88 | Login User - Refactor
