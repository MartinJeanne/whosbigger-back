const jsdom = require("jsdom");
const redis = require('./redisClient');

module.exports = async function (choiceName) {
    const key = `${choiceName}_IMG`;
    let imageUrl = await redis.getSTR(key);
    if (imageUrl) return imageUrl;

    imageUrl = await scrapWikipediaImage(choiceName);
    redis.saveSTR(key, imageUrl);
    return imageUrl;
}

async function scrapWikipediaImage(name) {
    const imgPageLink = await fetch(`https://fr.wikipedia.org/wiki/${name}`)
        .then(response => response.text())
        .then(function (html) {
            const dom = new jsdom.JSDOM(html);
            const table = dom.window.document.querySelector('table.infobox_v2.infobox');
            const a = table.querySelector('a');
            return a;
        })
        .catch(console.error);

    return await fetch(`https://fr.wikipedia.org/${imgPageLink}`)
        .then(response => response.text())
        .then(function (html) {
            const dom = new jsdom.JSDOM(html);
            const imageAnchor = dom.window.document.querySelector('.fullImageLink > a');
            return `https:${imageAnchor.href}`;
        })
        .catch(console.error);
}
