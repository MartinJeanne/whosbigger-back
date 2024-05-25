const jsdom = require("jsdom");
const redis = require('./redisClient');

module.exports = async function (choiceName) {
    if (!choiceName) return '';

    const key = `${choiceName}_IMG`;
    let imageUrl = await redis.getSTR(key);
    if (imageUrl) return imageUrl;

    try {
        imageUrl = await scrapWikipediaImage(choiceName);
        if (imageUrl) redis.saveSTR(key, imageUrl);
    } catch (error) {
        console.error(error);
        return '';
    }

    return imageUrl;
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
