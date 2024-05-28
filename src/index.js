const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

const townFRprovider = require('./provider/communesProvider');
const { getImage, scrapAllImage } = require('./getImage');

const corsOptions = {
    origin: (origin, callback) => {
        if (checkOrigin(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
};

const checkOrigin = (origin) => {
    // Check if the origin is undefined (for same-origin requests like Postman or curl)
    if (!origin) return true;

    // Extract the hostname from the origin
    const hostname = new URL(origin).hostname;

    // Allow if the hostname matches the allowed IP address
    return ['localhost', '62.171.131.91'].includes(hostname);
};

app.use(cors(corsOptions));

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
