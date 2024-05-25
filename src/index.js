const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

const townFRprovider = require('./provider/townFRprovider');
const getImage = require('./getImage');

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
    if (!req.query.choiceType)
        return res.send({ error: 'Query params must be defined: choiceType ' });

    let choice;
    switch (req.query.choiceType) {
        case 'townFR':
            choice = await townFRprovider.getChoice(req.query.choiceType);
            break;

        default:
            return res.send({ error: 'Unknow choice type' });
    }

    res.send(choice);
});

app.get('/choices/:name/image', async (req, res) => {
    const imageUrl = await getImage(req.params.name);

    if(imageUrl) res.send({ image: imageUrl });
    else res.status(404).send('Image not found');
});

app.listen(port, () => {
    console.log(`whosbigger-back is running on port: ${port}`);
});
