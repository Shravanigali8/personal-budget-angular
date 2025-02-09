const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Use CORS if needed
// app.use(cors());


app.use('/', express.static('public'));


app.get('/hello', (req, res) => {
    res.send('Hello world');
});

app.get('/budget', (req, res) => {
    
    fs.readFile(path.join(__dirname, 'budget-data.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read budget data' });
        } else {
            res.json(JSON.parse(data));
        }
    });
});


app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});