const express = require('express');
const app = express();
const port = 3000;

const townFRprovider = require('./provider/townFRprovider');


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

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
