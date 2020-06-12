const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const session = require('express-session')
const express = require('express');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// add & configure middleware
app.use(session({
    genid: (req) => {
        console.log('Inside the session middleware')
        console.log(req.sessionID)
        return uuidv4() // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
});

// create the login get and post routes
app.get('/login', (req, res) => {
    console.log('Inside GET /login callback function')
    console.log(req.sessionID)
    res.send(`You got the login page!\n`)
})

app.post('/login', (req, res) => {
    console.log('Inside POST /login callback function');
    console.log(req.body);
    res.send(`You posted to the login page!\n`);
})

app.listen(5000);
console.log("This app is running on http://localhost:5000/")