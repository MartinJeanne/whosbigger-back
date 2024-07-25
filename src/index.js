const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

const townFRprovider = require('./provider/communesProvider');
const { getImage, scrapAllImage } = require('./getImage');

app.use(cors());

app.get('/choices', async (req, res) => {
    const difficulty = req.query.difficulty;
    const difficultyEnum = ['hard', 'medium', 'easy'];

    if (!difficulty || !difficultyEnum.includes(difficulty))
        return res.status(400).send({ error: `'${difficulty}' isn't a valid difficulty. Valid ones are: ${difficultyEnum}` })
    let choice = await townFRprovider.getChoice(difficulty);
    res.send(choice);
});

app.get('/choices/:name/image', async (req, res) => {
    const imageUrl = await getImage(req.params.name);

    if (imageUrl) res.send({ image: imageUrl });
    else res.status(404).send('Image not found');
});

app.post('/choices/images', async (req, res) => {
    await scrapAllImage();
    res.send('Scraped all images!');
});

app.listen(port, () => {
    console.log(`whosbigger-back is running on port: ${port}`);
});
