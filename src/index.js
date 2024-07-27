const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey  = fs.readFileSync('sslcert/selfsigned.key', 'utf8');
const certificate = fs.readFileSync('sslcert/selfsigned.crt', 'utf8');

const credentials = {key: privateKey, cert: certificate};
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const townFRprovider = require('./provider/communesProvider');
const { getImage, scrapAllImage } = require('./getImage');


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

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(3001, () => {
    console.log(`http server of whosbigger-back is ready!`);
});

httpsServer.listen(443, () => {
    console.log(`https server of whosbigger-back is ready!`);
});
