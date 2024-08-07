const http = require('http');
const express = require('express');
const app = express();

const townFRprovider = require('./provider/communesProvider');
const { getImage, scrapAllImage } = require('./getImage');

app.get('/api/choices', async (req, res) => {
    console.log('Origin: ' + req.headers.origin)
    const difficulty = req.query.difficulty;
    const difficultyEnum = ['hard', 'medium', 'easy'];

    if (!difficulty || !difficultyEnum.includes(difficulty))
        return res.status(400).send({ error: `'${difficulty}' isn't a valid difficulty. Valid ones are: ${difficultyEnum}` })
    let choice = await townFRprovider.getChoice(difficulty);
    res.send(choice);
});

app.get('/api/choices/:name/image', async (req, res) => {
    const imageUrl = await getImage(req.params.name);

    if (imageUrl) res.send({ image: imageUrl });
    else res.status(404).send('Image not found');
});

app.post('/api/choices/images', async (req, res) => {
    await scrapAllImage();
    res.send('Scraped all images!');
});

const port = 3000;
http.createServer(app).listen(port, () => {
    console.log(`whosbigger-back REST API listening on port: ${port}`);
});
