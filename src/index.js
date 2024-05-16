const express = require('express');
const app = express();
const port = 3000;

const redis = require('./redisClient');

const apiGeo = 'https://geo.api.gouv.fr';
const choicesKey = 14;

app.get('/game/create', async (req, res) => {
});

app.get('/game/stop', async (req, res) => {
});

app.get('/game/continue', async (req, res) => {
    let allChoices = await redis.getJSON(choicesKey);

    if (!allChoices) {
        allChoices = await fetch(`${apiGeo}/departements/${choicesKey}/communes`)
            .then(response => response.json())
            .catch(console.error)
    }

    redis.saveJSON(choicesKey, allChoices);

    const rawChoice1 = getRandomElement(allChoices);
    const index = allChoices.indexOf(rawChoice1);
    allChoices.splice(index, 1);
    const rawChoice2 = getRandomElement(allChoices);

    const choices = toChoices(rawChoice1, rawChoice2);
    res.send(choices);
});

function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function toChoices(rawChoice1, rawChoice2) {
    const choice1 = { 
        name: rawChoice1.nom,
        data: rawChoice1.population,
        correctAwnser: false
    }
    const choice2 = { 
        name: rawChoice2.nom,
        data: rawChoice2.population,
        correctAwnser: false
    }

    if (choice1.data > choice2.data)
        choice1.correctAwnser = true;

    choice2.correctAwnser = !choice1.correctAwnser;
    return [choice1, choice2];
}

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
