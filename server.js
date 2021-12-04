const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/board.js', function(req, res){
    res.sendFile(__dirname + '/board.js');
});

app.get('/ai.js', function(req, res){
    res.sendFile(__dirname + '/ai.js');
});

app.get('/index.js', function(req, res){
    res.sendFile(__dirname + '/index.js');
});

app.use('/img', express.static(process.cwd() + '/img'))

app.listen(PORT, () => {
    console.log(`App running at port ${PORT}`);
});