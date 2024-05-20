const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

const townFRprovider = require('./provider/townFRprovider');

app.use(cors({
    origin: 'http://62.171.131.91', // Allow the specific origin
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
}));

app.get('/game/create', async (req, res) => {
});

app.get('/game/stop', async (req, res) => {
});

app.get('/game/continue', async (req, res) => {
    if (!req.query.choiceType)
        return res.send({ error: 'Query params must be defined: choiceType ' });

    let choice;
    switch (req.query.choiceType) {
        case 'townFR':
            choice = await townFRprovider.getChoice(req.query.choiceType);
            break;

        default:
            return res.send({ error: 'Unknow choice type' });
    }

    res.send(choice);
});

app.listen(port, () => {
    console.log(`whosbigger-back is running on port: ${port}`);
});
