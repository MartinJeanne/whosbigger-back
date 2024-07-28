const http = require('http');
const express = require('express');
const app = express();

const townFRprovider = require('./provider/communesProvider');
const { getImage, scrapAllImage } = require('./getImage');

// CORS
const allowedOrigins = ['linkstart.club', 'www.linkstart.club']
app.use(function (req, res, next) {
    console.log('Begin CORS');
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type');
    }

    const origin = req.get('origin');
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        console.log('Header set for CORS');
    }
    next();
});

app.get('/api/choices', async (req, res) => {
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
