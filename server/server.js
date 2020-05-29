const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html')));
const datetime = new Date();
app.get('/date', (req, res) => res.send(datetime.toISOString()))
app.listen(9000);
console.log("This app is running on http://localhost:9000/")
