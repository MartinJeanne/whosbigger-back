const jsdom = require("jsdom");
const mongoDB = require('./mongoClient');
const townFRprovider = require('./provider/communesProvider');

exports.getImage = async function (choiceName) {
    if (!choiceName) return '';

    let image = await mongoDB.getImage(choiceName);
    if (image) return image.url;

    try {
        const imageUrl = await scrapWikipediaImage(choiceName);
        if (imageUrl) {
            mongoDB.saveImage(choiceName, imageUrl);
            return imageUrl;
        }
    } catch (error) {
        console.error(error);
        return '';
    }
}

exports.scrapAllImage = async function () {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

    const allCities = await townFRprovider.getChoices();

    for (let i = 0; i < allCities.length; i++) {
        const img = await exports.getImage(allCities[i].nom);
        await delay(200);
    }
}

async function scrapWikipediaImage(name) {
    const imgPageLink = await scrapImgPageLink(name);
    if (!imgPageLink) return '';
    return scrapFinalImg(imgPageLink);
}

async function scrapImgPageLink(name) {
    const html = await fetch(`https://fr.wikipedia.org/wiki/${name}`)
        .then(response => response.text())
        .catch(console.error);

    const dom = await new jsdom.JSDOM(html);
    const table = await dom.window.document.querySelector('table.infobox_v2.infobox');

    if (!table && !name.includes('_(Calvados)')) {
        return scrapImgPageLink(`${name}_(Calvados)`)
    }
    else if (!table) {
        console.log('Image not found: ' + `https://fr.wikipedia.org/wiki/${name}`);
        return null;
    }
    const a = await table.querySelector('a');
    return a;
}

async function scrapFinalImg(imgPageLink) {
    const html = await fetch(`https://fr.wikipedia.org/${imgPageLink}`)
        .then(response => response.text())
        .catch(console.error);

    const dom = await new jsdom.JSDOM(html);
    const imageAnchor = await dom.window.document.querySelector('.fullImageLink > a');
    return `https:${imageAnchor.href}`;
}
