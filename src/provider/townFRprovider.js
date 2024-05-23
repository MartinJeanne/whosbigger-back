const { response } = require('express');
const redis = require('../redisClient');
const google = require('googlethis');

const apiGeo = 'https://geo.api.gouv.fr';

exports.getChoice = async function (choiceType) {
    let allCities = await redis.getJSON(choiceType);

    if (!allCities) {
        allCities = await fetch(`${apiGeo}/departements/14/communes`)
            .then(response => response.json())
            .catch(console.error);

        // Remove the villages
        allCities = allCities.filter((c) => c.population > 2000);
        redis.saveJSON(choiceType, allCities);
    }

    const city1 = getRandomElement(allCities);
    const indexToDelete = allCities.indexOf(city1);
    allCities.splice(indexToDelete, 1);
    const city2 = getRandomElement(allCities);

    const choices = toChoices(city1, city2);

    for (let i = 0; i < choices.length; i++) {
        choices[i].metadata.weather = await getWeather(choices[i].name);
    }

    return choices;
}

async function getWeather(name) {
    const cityName = name.replace(' ', '+');

    const weatherRes = await fetch(`http://wttr.in/${cityName}?format=3`)
        .catch(console.error);

    if (weatherRes.ok) {
        let weather = await weatherRes.text();
        weather = weather.slice(0, -1);
        return weather;
    }
}

function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

async function getImage(choice) {
    const searchOptions = {
        safe: false, // Safe Search
        parse_ads: false, // If set to true sponsored results will be parsed
    }

    const images = await google.image(`${choice.name}`, searchOptions);
    if (images) return images[0];
}



function toChoices(rawChoice1, rawChoice2) {
    const choice1 = {
        name: rawChoice1.nom,
        data: rawChoice1.population,
        image: '',
        metadata: {},
        isCorrectAwnser: false,
    }
    const choice2 = {
        name: rawChoice2.nom,
        data: rawChoice2.population,
        image: '',
        metadata: {},
        isCorrectAwnser: false,
    }

    if (choice1.data > choice2.data)
        choice1.isCorrectAwnser = true;

    choice2.isCorrectAwnser = !choice1.isCorrectAwnser;
    return [choice1, choice2];
}
