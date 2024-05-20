const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3001;

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
