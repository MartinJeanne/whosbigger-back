const mongoDB = require('../mongoClient');
const apiGeo = 'https://geo.api.gouv.fr';

exports.getChoices = async function () {
    let allCommunes = await mongoDB.getCommunes();

    if (allCommunes.length === 0) {
        allCommunes = await fetch(`${apiGeo}/departements/14/communes?fields=nom,centre,population`)
            .then(response => response.json())
            .catch(console.error);

        mongoDB.saveCommunes(allCommunes);
    }

    return allCommunes;
}

exports.getChoice = async function (difficulty) {
    let allCommunes = await exports.getChoices();

    switch (difficulty) {
        case 'hard':
            // Keep all the communes
            break;

        case 'medmium':
            allCommunes = allCommunes.filter((c) => c.population > 2000);
            break;

        case 'easy':
            allCommunes = allCommunes.filter((c) => c.population > 4000);
            break;
    }

    const commune1 = getRandomElement(allCommunes);
    const indexToDelete = allCommunes.indexOf(commune1);
    allCommunes.splice(indexToDelete, 1);
    const commune2 = getRandomElement(allCommunes);

    const choices = toChoices(commune1, commune2);

    for (let i = 0; i < choices.length; i++) {
        choices[i].metadata.weather = await getWeather(choices[i].metadata.location);
    }

    return choices;
}

async function getWeather(location) {
    const lon = location.coordinates[0];
    const lat = location.coordinates[1];

    const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`)
        .then(response => {
            if (response.ok) return response.json();
        })
        .catch(console.error);

    if (weather) return `${weather.current.temperature_2m}°C`;
    return '';
}

function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function toChoices(rawChoice1, rawChoice2) {
    const choice1 = {
        name: rawChoice1.nom,
        data: rawChoice1.population,
        metadata: {
            location: rawChoice1.centre
        },
        isCorrectAwnser: false,
    }
    const choice2 = {
        name: rawChoice2.nom,
        data: rawChoice2.population,
        metadata: {
            location: rawChoice2.centre
        },
        isCorrectAwnser: false,
    }

    if (choice1.data > choice2.data)
        choice1.isCorrectAwnser = true;

    choice2.isCorrectAwnser = !choice1.isCorrectAwnser;
    return [choice1, choice2];
}
