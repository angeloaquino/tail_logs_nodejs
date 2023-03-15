const fs = require('fs');
const http = require('http'); //change to https but needs certificate .pem .cer
const express = require('express');
const app = express();
const hostname = '127.0.0.1'; // IP localhost
const port = 3000; //port interchangebale

app.get('/', (req, res) => {
    res.send('Hello World!');
    res.status(204);
})
app.get('/servicecheck.html', (req, res) => {
    res.send('Hello World!2');
    res.status(200);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
