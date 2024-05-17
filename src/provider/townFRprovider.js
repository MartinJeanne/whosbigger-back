const redis = require('../redisClient');
const apiGeo = 'https://geo.api.gouv.fr';

exports.getChoice = async function (choiceType) {
    let allChoices = await redis.getJSON(choiceType);

    if (!allChoices) {
        allChoices = await fetch(`${apiGeo}/departements/14/communes`)
            .then(response => response.json())
            .catch(console.error);

        // Remove the villages
        allChoices = allChoices.filter((c) => c.population > 2000);
    }

    redis.saveJSON(choiceType, allChoices);

    const rawChoice1 = getRandomElement(allChoices);
    const indexToDelete = allChoices.indexOf(rawChoice1);
    allChoices.splice(indexToDelete, 1);
    const rawChoice2 = getRandomElement(allChoices);

    return toChoices(rawChoice1, rawChoice2);
}

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
