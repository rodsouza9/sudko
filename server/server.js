const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const session = require('express-session')
const FileStore = require('session-file-store')(session); // need to be replaced w database
const express = require('express');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const axios = require('axios');

const HTTP_SERVER = 'http://localhost:5000/';
const DB_SERVER = 'http://localhost:4000/';


// this is
const users = [
    {id: '2f24vvg', email: 'test@test.com', password: 'password'}
]
// Passport setup
// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
        // this needs to be changed to use mongo db later
        axios.get(DB_SERVER + `users?email=${email}`)
            .then(res => {
                const user = res.data[0]
                if (!user) {
                    return done(null, false, { message: 'Invalid credentials.\n' });
                }
                if (password != user.password) {
                    return done(null, false, { message: 'Invalid credentials.\n' });
                }
                return done(null, user);
            })
            .catch(error => done(error));
    }
));
// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    axios.get(DB_SERVER + `users/${id}`)
        .then(res => done(null, res.data) )
        .catch(error => done(error, false))
});


// express server
const app = express();


// add & configure middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    genid: (req) => {
        return uuidv4() // use UUIDs for session IDs
    },
    store: new FileStore(), // need to be replaced w database
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 9876543210}
}))
app.use(passport.initialize());
app.use(passport.session());

// set path for routes
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
});

// Either choose single page style or send login page here
app.get('/login', (req, res) => {
    res.send(`You got the login page!\n`)
})

// login post route
app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(info) {return res.send(info.message)}
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.login(user, (err) => {
            if (err) { return next(err); }
            return res.redirect('/authrequired');
        })
    })(req, res, next);
})

app.get('/authrequired', (req, res) => {
    console.log(`User authenticated? ${req.isAuthenticated()}`)
    if(req.isAuthenticated()) {
        res.send('you hit the authentication endpoint\n')
    } else {
        res.redirect('/')
    }
})

//listen bruh
app.listen(5000);
console.log("This app is running on" + HTTP_SERVER)