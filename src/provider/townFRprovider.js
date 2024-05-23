const redis = require('../redisClient');
const google = require('googlethis');

const apiGeo = 'https://geo.api.gouv.fr';

exports.getChoice = async function (choiceType) {
    let allChoices = await redis.getJSON(choiceType);

    if (!allChoices) {
        allChoices = await fetch(`${apiGeo}/departements/14/communes`)
            .then(response => response.json())
            .catch(console.error);

        // Remove the villages
        allChoices = allChoices.filter((c) => c.population > 2000);
        redis.saveJSON(choiceType, allChoices);
    }

    const rawChoice1 = getRandomElement(allChoices);
    const indexToDelete = allChoices.indexOf(rawChoice1);
    allChoices.splice(indexToDelete, 1);
    const rawChoice2 = getRandomElement(allChoices);

    const choices = toChoices(rawChoice1, rawChoice2);

    const searchOptions = {
        safe: false, // Safe Search
        parse_ads: false, // If set to true sponsored results will be parsed
    }

    for (let i = 0; i < choices.length; i++) {
        // Image Search
        const images = await google.image(`${choices[i].name} landscape`, searchOptions);

        if (images) choices[i].image = images[0];
    }

    return choices;
}

function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function toChoices(rawChoice1, rawChoice2) {
    const choice1 = {
        name: rawChoice1.nom,
        data: rawChoice1.population,
        image: '',
        isCorrectAwnser: false,
    }
    const choice2 = {
        name: rawChoice2.nom,
        data: rawChoice2.population,
        image: '',
        isCorrectAwnser: false,
    }

    if (choice1.data > choice2.data)
        choice1.isCorrectAwnser = true;

    choice2.isCorrectAwnser = !choice1.isCorrectAwnser;
    return [choice1, choice2];
}
