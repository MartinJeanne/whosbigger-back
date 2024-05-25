const redis = require('../redisClient');
const apiGeo = 'https://geo.api.gouv.fr';

exports.getChoices = async function (choiceType) {
    let allCities = await redis.getJSON(choiceType);

    if (!allCities) {
        allCities = await fetch(`${apiGeo}/departements/14/communes?fields=nom,centre,population`)
            .then(response => response.json())
            .catch(console.error);

        // Remove the villages
        allCities = allCities.filter((c) => c.population > 2000);
        redis.saveJSON(choiceType, allCities);
    }

    return allCities;
}

exports.getChoice = async function (choiceType) {
    const allCities = await exports.getChoices(choiceType);

    const city1 = getRandomElement(allCities);
    const indexToDelete = allCities.indexOf(city1);
    allCities.splice(indexToDelete, 1);
    const city2 = getRandomElement(allCities);

    const choices = toChoices(city1, city2);

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
