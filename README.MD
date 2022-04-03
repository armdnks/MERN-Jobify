## MERN Stack Course 2022 - MongoDB, Express, React and NodeJS

### by John Smilga on Udemy

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
- git init

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

#### React ver.17

```js
"@testing-library/jest-dom": "^5.15.0",
"@testing-library/react": "^11.2.7",
"@testing-library/user-event": "^12.8.3",
"react": "^17.0.2",
"react-dom": "^17.0.2",
"react-scripts": "4.0.3",
```

#### React ver.18

```js
"@testing-library/jest-dom": "^5.16.3",
"@testing-library/react": "^12.1.4",
"@testing-library/user-event": "^13.5.0",
"react": "^18.0.0",
"react-dom": "^18.0.0",
"react-scripts": "5.0.0",
```

---

#### .env setup

```
NODE_ENV
PORT
MONGO_URL
JWT_SECRET
JWT_LIFETIME
FAST_REFRESH = false
```
